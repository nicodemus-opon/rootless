module.exports = {
  title: 'Rootless | Documentation',
  tagline: 'Integrate Tirra',
  url: '/docs',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/rootless.svg',
  organizationName: 'Rootless', // Usually your GitHub org/user name.
  projectName: 'Rootless', // Usually your repo name.
  themeConfig: {
    sidebarCollapsible: true,
    navbar: {
      title: '',
      logo: {
        alt: 'My Site Logo',
        src: 'img/rootless.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'Homepage',
          position: 'left',
        },
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://tirra.me/auth',
          label: 'Login',
          position: 'right',

        },
        {
          href: 'https://tirra.me/auth',
          label: 'Sign up',
          position: 'right',
          className: 'btn-primary',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',

          // Add additional dropdown items at the beginning/end of the dropdown.
          dropdownItemsBefore: [],
          dropdownItemsAfter: [{to: '/versions', label: 'All versions'}],

          // Do not add the link active class when browsing docs.
          dropdownActiveClassDisabled: true,
        },
      ],
    },

    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tirra.`,
    },
    prism: {
      theme: require('prism-react-renderer/themes/tirraUltraMin'),
      darkTheme: require('prism-react-renderer/themes/tirraUltraMin'),
      defaultLanguage: 'javascript',
    },
    announcementBar: {
      id: 'tirra_beta', // Any value that will identify this message.
      content:
        'Currently under development',
      backgroundColor: 'var(--accent-1)', // Defaults to `#fff`.
      textColor: 'var(--text)', // Defaults to `#000`.
      isCloseable: true, // Defaults to `true`.
    },
    colorMode: {
      // "light" | "dark"
      defaultMode: 'light',
      // Hides the switch in the navbar
      // Useful if you want to support a single color mode
      disableSwitch: false,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],


};
