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
     * Tells if the description is a clone of a previous one.
     */
    this.isInherited = !!jsonDescription.inheritedFrom;
    /**
     * At first this is real markdown, but it will
     * be replace with html later.
     */
    this.markdown = jsonDescription.markdown;
  }

}
