const createResizedVersions = require('./createResizedVersions');
const Vue = require('vue/dist/vue');
const path = require('path');

const IPHONE = 'iPhone';
const IPAD = 'iPad';

const app = new Vue({
  el: '#root',
  data: {
    statusText: '',
    outputPath: '',
    sourcePath: '',
    platformFilters: {
      [IPHONE]: true,
      [IPAD]: true,
    },
    versions: [
      {
        label: 'iPhone Notification',
        platforms: [IPHONE],
        baseSize: 20,
        multiples: [2, 3],
      },
      {
        label: 'iPhone Settings',
        platforms: [IPHONE],
        baseSize: 29,
        multiples: [2, 3],
      },
      {
        label: 'iPhone Spotlight',
        platforms: [IPHONE],
        baseSize: 40,
        multiples: [2, 3],
      },
      {
        label: 'iPhone App',
        platforms: [IPHONE],
        baseSize: 60,
        multiples: [2, 3],
      },
      {
        label: 'iPad Notifications',
        platforms: [IPAD],
        baseSize: 20,
        multiples: [1, 2],
      },
      {
        label: 'iPad Settings',
        platforms: [IPAD],
        baseSize: 29,
        multiples: [1, 2],
      },
      {
        label: 'iPad Spotlight',
        platforms: [IPAD],
        baseSize: 40,
        multiples: [1, 2],
      },
      {
        label: 'iPad App',
        platforms: [IPAD],
        baseSize: 76,
        multiples: [1, 2],
      },
      {
        label: 'App Store',
        platforms: [IPHONE, IPAD],
        baseSize: 1024,
        multiples: [1],
      },
    ],
  },
  computed: {
    requiredInputProvidedForResizing() {
      return this.sourcePath && this.outputPath;
    },
    filteredVersions() {
      return this.versions.filter(version => {
        return version.platforms.some(
          platformName => this.platformFilters[platformName]
        );
      });
    },
    flattenedVersions(sizes) {
      const imagePath = this.sourcePath;
      const imageExtension = path.extname(imagePath);
      const imageName = path.basename(imagePath, imageExtension);

      return this.filteredVersions.reduce(
        (allVersions, { multiples, baseSize }) => {
          const currentVersions = multiples.map(multiplier => ({
            name: `${imageName}-${baseSize}@${multiplier}x${imageExtension}`,
            size: baseSize * multiplier,
          }));
          return [...allVersions, ...currentVersions];
        },
        []
      );
    },
  },
  methods: {
    createResizedImages() {
      this.statusText = 'Creating resized images...';
      const resizePromises = createResizedVersions(
        this.sourcePath,
        this.outputPath,
        this.flattenedVersions
      );

      Promise.all(resizePromises).then(() => {
        this.statusText = `Successfully created ${resizePromises.length} resized images.`;
      });
    },
  },
});

(() => {
  document
    .getElementById('output-select__handle')
    .addEventListener('click', _ => {
      document.getElementById('output-select__input').click();
    });

  document
    .getElementById('output-select__input')
    .addEventListener('change', e => {
      app.outputPath = e.target.files[0].path;
    });

  const holder = document.getElementById('drag');

  holder.ondragover = holder.ondragleave = holder.ondragend = () => false;

  holder.ondrop = e => {
    e.preventDefault();

    for (let file of e.dataTransfer.files) {
      app.sourcePath = file.path;
    }

    return false;
  };
})();
