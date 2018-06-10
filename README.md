# Inventory App (Hybrid Desktop App.)

Simple tool that let you manage your phone contacts vCard file (.vcf), simply import the file into the app and edit your contacts right away. You can search, add, edit, delete contacts. Also you can export your contacts back to a vcf file to import intro your phone or export as excel sheet.

## Used Tools
- AngularJS
- AngularJS Material
- Electron Atom

## How to use
- Open terminal and Clone repo
```sh
git clone https://github.com/mmounirf/InventoryApp && cd InventoryApp
```
- Install dependencies.
```sh
npm install
```
- Start the app.
```sh
npm start
```
## How to build executable file
- Run Electron Packager 
```sh
electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional flags...]
```
 1. `<sourcedir>`: Directory where the output package should be saved.
 2. `<appname>`: Executable file name
 3. `<platform>`: Targeted Platform
 
    3.1  `linux`
    
    3.2 `win32`
    
    3.3 `darwin`
    
    3.4 `mas`
    
    3.5 `all`
    
 4. `<platform>`: Targeted Platform Architecture
 
    4.1 `ia32`
    
    4.2 `x64`
    
    4.3 `armv7l`
    
    4.4 `arm64`
    
5.   `[optional flags]`

     5.1 `asar`: Whether to package the application's source code into an archive, using Electron's archive format `Boolean (default: false).

     5.2 `icon`: The local path to the icon file, if the target platform supports setting embedding an icon. `String`

[Read more](https://github.com/electron-userland/electron-packager/blob/master/docs/api.md)
