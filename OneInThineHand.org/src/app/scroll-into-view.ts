export function scrollIntoView(selector: string, options?: Options): boolean {
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
        element.scrollIntoView(
          options ? options.scollIntoViewOptions : undefined,
        );
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
  public scollIntoViewOptions?: ScrollIntoViewOptions;
}

export async function asyncQuerySelector(
  selector: string,
): Promise<Element | null> {
  return document.querySelector(selector);
}
export async function asyncScrollTop(
  selector: string,
  top: number = 0,
): Promise<void> {
  const element = await asyncQuerySelector(selector);

  if (element) {
    element.scrollTop = top;
  }
}
