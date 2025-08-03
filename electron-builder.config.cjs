function artifactName({ arch, ext, type }) {
  const isPortable = type === "portable";
  const base = `BarcodeGenerator-${arch}`;
  return `${base}-${isPortable ? "portable" : "installer"}.${ext}`;
}

/** @type {import('electron-builder').Configuration} */
module.exports = {
  appId: "com.happyfox-devs.barcodegenerator",
  productName: "BarcodeGenerator",
  icon: "public/icon.png",
  directories: {
    output: ".build",
    buildResources: "build",
  },
  files: ["dist/**/*", "electron/**/*"],
  win: {
    target: [{ target: "nsis", arch: ["x64", "ia32"] }],
  },
  nsis: {
    oneClick: false,
    perMachine: true,
    allowToChangeInstallationDirectory: true,
    artifactName: "${productName}-${version}-${arch}-installer.${ext}",
  },
  portable: {
    artifactName: "${productName}-${version}-${arch}-portable.${ext}",
  },
  publish: [
    {
      provider: "github",
      owner: "happy-fox-devs",
      repo: "barcode-generator",
    },
  ],
};
