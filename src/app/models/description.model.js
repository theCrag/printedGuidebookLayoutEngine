/**
 * Description block of an area. Normally in the markdown format,
 * but it will be replaced with the html.
 */
export class Description {

  /**
   * @param {JsonObject} jsonDescription
   */
  constructor(jsonDescription) {
    /**
     * The name of the description block.
     */
    this.name = jsonDescription.name;
    /**
     * At first this is real markdown, but it will
     * be replace with html later.
     */
    this.markdown = jsonDescription.markdown;
  }

}
