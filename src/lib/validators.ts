function isValidBase64Image(image: string) {
  const base64Pattern =
    /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return base64Pattern.test(image);
}

export { isValidBase64Image };
