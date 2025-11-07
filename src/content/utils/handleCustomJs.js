function executeInPageContext(code, context = {}) {
  const wrappedCode = `
    (() => {
      const CONTEXT = ${JSON.stringify(context)};
      console.log(CONTEXT);
      ${code}
    })();
  `;

  const blob = new Blob([wrappedCode], { type: 'text/javascript' });
  const blobUrl = URL.createObjectURL(blob);

  const script = document.createElement('script');
  script.src = blobUrl;
  (document.head || document.documentElement).appendChild(script);

  script.onload = () => {
    URL.revokeObjectURL(blobUrl);
    script.remove();
  };
}

export default executeInPageContext;