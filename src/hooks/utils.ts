export const srcLocal = (fullpath: string): string =>  {
  if (import.meta.env.PROD) {
    return `${fullpath}`
  } else {
    return `/http_get?path=${encodeURIComponent(fullpath)}`
  }
}

export const writeFile = (fullpath: string, content: string): Promise<void> => {
  if (import.meta.env.PROD) {
    return window.pywebview.api.write_file(fullpath, content)
  } else {
    return fetch(`/api_dev/write_file?path=${encodeURIComponent(fullpath)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: content
    }).then()
  }
}
