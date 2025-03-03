#!/usr/bin/env bun

import path from 'path';
import fs from 'fs';
import { version, name } from './package.json'
import { konsol, prompt, confirm } from './src/cli';
import { registerInstallationHook } from './src/hooks/dependencies';
import { afterCreateHook, projectDependenciesHook } from './src/hook';
import { createSpinner } from 'nanospinner'
import yargsParser from 'yargs-parser';
// @ts-ignore: no types
import download from 'download-git-repo';


/*
 * Create a new hihono project
 * Informatif CLI tool to create a new hihono project
 * Steps:
 * 1. Check Project name include in arguments command or not, if not prompt the project name, and notify if blank the default project name is "hihono-app"
 * 2. Check directory of project name if not exist then create a new directory, if exist then notify and prompt to overwrite the directory or not, if not close the program and notify the error cancelled by user
 * 3. After create a new directory, copy the template from github riod94/hihono to the new directory
 * 4. After copy the template finish then install the dependencies using bun install
 * 5. After install the dependencies finish then notify the success create a new hihono project and show the message "cd <project-name> && bun dev"
 */
const directoryName = ''
const config = {
    directory: directoryName,
    provider: 'github',
    repository: 'hihono',
    user: 'riod94',
    ref: 'main',
}

function mkdirp(dir: string) {
    try {
        fs.mkdirSync(dir, { recursive: true })
    } catch (e) {
        if (e instanceof Error) {
            if ('code' in e && e.code === 'EEXIST') return
        }
        throw e
    }
}

async function main() {
    console.info(konsol.yellow(`${name} version ${version}`))

    const args = yargsParser(process.argv.slice(2))

    const { install, pm, template: templateArg } = args

    let target = ''
    let projectName = ''
    if (args._[0]) {
        target = args._[0].toString()
        console.log(konsol.bold(`${'✔'} Using target directory … ${konsol.yellow(target)}`))
        projectName = path.basename(target)
    } else {
        const answer = await prompt('Target directory', 'hihono-app')
        target = answer
        if (answer === '.') {
            projectName = path.basename(process.cwd())
        } else {
            projectName = path.basename(answer)
        }
    }

    const templateName = templateArg || 'default'

    if (fs.existsSync(target)) {
        if (fs.readdirSync(target).length > 0) {
            const response = await confirm('Directory not empty. Continue?', false)
            // if continue then delete the directory
            if (!response) {
                console.warn(konsol.red('Installation cancelled by user'))
                process.exit()
            }
            fs.rmSync(target, { recursive: true, force: true })
        }
    } else {
        mkdirp(target)
    }

    const targetDirectoryPath = path.join(process.cwd(), target)

    await new Promise((res, rej) => {
        const spinner = createSpinner('Cloning the template').start()
        download(`${config.provider}:${config.user}/${config.repository}#${config.ref}`, targetDirectoryPath, { clone: true }, (err: any) => {
            if (err) {
                spinner.error({ text: 'Failed to clone the template' })
                console.error(err)
                rej(err)
                process.exit(1)
            } else {
                spinner.success()
                res(true)
            }
        })
    })

    registerInstallationHook(templateName, install, pm)

    try {
        afterCreateHook.applyHook(templateName, {
            projectName,
            directoryPath: targetDirectoryPath,
        })

        await Promise.all(
            projectDependenciesHook.applyHook(templateName, {
                directoryPath: targetDirectoryPath,
            }),
        )
    } catch (e) {
        throw new Error(
            `Error running hook for ${templateName}: ${e instanceof Error ? e.message : e
            }`,
        )
    }

    const packageJsonPath = path.join(targetDirectoryPath, 'package.json')

    if (fs.existsSync(packageJsonPath)) {
        const packageJson = fs.readFileSync(packageJsonPath, 'utf-8')

        const packageJsonParsed = JSON.parse(packageJson)
        const newPackageJson = {
            name: projectName,
            ...packageJsonParsed,
        }

        fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2))
    }

    console.log(konsol.green(`🎉 Copied project files`))
    console.log(`\n Get started with:`)
    console.log(konsol.yellow(` \n cd ${target} && bun dev`))
}

main()