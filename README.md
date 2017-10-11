# MultiOgar-Edited-Unlimited

A fast, open source server that supports multiple protocol versions and smooth vanilla physics.

Since August of 2017, [Tyler3D](https://github.com/Tyler3D) has stopped working on this project. So I forked the code and remade it into MultiOgar-Edited-Unlimited. An updated version of the previous MultiOgar.

## Information
Current version : **1.0.4**
**New update : Command for console "chat" **

![Language](https://img.shields.io/badge/language-node.js-yellow.svg)
[![License](https://img.shields.io/badge/license-APACHE2-blue.svg)](https://github.com/Barbosik/OgarMulti/blob/master/LICENSE.md)

Original MultiOgar code is based on the private server implementation [Cigar](https://github.com/CigarProject/Cigar). The original code rightfully belongs to the [CigarProject](https://github.com/CigarProject).

MultiOgar-Edited-Unlimited code however, is based on MultiOgar code that has been heavily modified and improved by many collaborators. The overall goal of this fork is to make physics as vanilla as possible, cleanup most of the code, and add lots of new features while maintaining better performance than the original MultiOgar.

## MultiOgar-Edited Wiki
Please see the issue template before you make an issue, you can find it [here](https://github.com/ArixProject/MultiOgar-Edited-Unlimited/wiki/Issue-Template). Along with client information, and a FAQ section. More coming soon!

## Installation
### Windows:
* Download and install node.js: https://nodejs.org/en/download/ 
* Download this repo
* Unzip MultiOgar-Edited-Unlimited code into some folder.

1. Run the win-Install_Dep.bat file.
2. Run win-Start.bat
* All these files can be found in the *run* folder.

*Manual*
Installing required modules.
```batch
:: Install Required Modules.
npm install

:: Starting the server. 
cd src
node index.js
```

#### Linux:
```bash
# First update your packages:
sudo apt-get update

# Install git:
sudo apt-get install git

# Install node.js:
sudo apt-get install nodejs-legacy npm

# Clone MultiOgar-Edited-Unlimited:
git clone git://github.com/ArixProject/MultiOgar-Edited-Unlimited.git

# Install dependencies:
cd MultiOgar-Edited-Unlimited
npm install

# Run the server:
cd src
sudo node index.js
```
