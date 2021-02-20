const path = require('path');
const fs = require('fs');
const packageJson = require('./package.json');

const {version} = packageJson;
const iconDir = path.resolve(__dirname, 'src', 'assets', 'img');

const config = {
  packagerConfig: {
    name: 'PDS Viewer',
    executableName: 'pds-viewer',
    asar: true,
    icon: path.resolve(__dirname, 'src', 'assets', 'img', 'logo'),
    appBundleId: 'sh.lrk.pds',
    appCategoryType: 'public.app-category.education',
    win32metadata: {
      CompanyName: 'PDS Viewer Contributors',
      OriginalFilename: 'PDS Viewer',
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: (arch) => {
        return {
          name: 'pds-viewer',
          authors: 'PDS Viewer Contributors',
          exe: 'pds-viewer.exe',
          iconUrl: 'https://raw.githubusercontent.com/lfuelling/pds-viewer/d38a2ce1271a7872f8f966f78e5c21b83874207d/src/assets/img/favicon.ico',
          noMsi: true,
          setupExe: `pds-viewer-${version}-win32-${arch}-setup.exe`,
          setupIcon: path.resolve(iconDir, 'favicon.ico'),
        };
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        icon: {
          scalable: path.resolve(iconDir, 'logo.svg'),
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'electron',
          name: 'fiddle',
        },
        draft: true,
        prerelease: false,
      },
    },
  ],
};

// Finally, export it
module.exports = config;
