export function scrollIntoView(
  selector: string,
  options: Options | undefined,
): boolean {
  let doc: Document | undefined;
  const timeout =
    options !== undefined && options.timeout ? options.timeout : 0;
  if (options !== undefined && options.document !== undefined) {
    doc = options.document;
  } else if (document !== undefined) {
    doc = document;
  } else {
    return false;
  }

  try {
    const element = doc.querySelector(selector);
    if (element) {
      setTimeout((): void => {
        element.scrollIntoView();
      }, timeout);
    }
  } catch (error) {
    return false;
  }
  return true;
}

export async function asyncScrollIntoView(
  selector: string,
  options?: Options | undefined,
): Promise<boolean> {
  return scrollIntoView(selector, options);
}

class Options {
  public document?: Document | undefined;
  public timeout?: number | undefined;
}
