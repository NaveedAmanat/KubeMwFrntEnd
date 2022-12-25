export class BreadCrumb {
  label: string;
  href: string;
  isSaved: boolean;
  isDisable: boolean;

  constructor(label: string, href: string) {
    this.label = label;
    this.href = href;
  }
}
