import { Slug } from "./slug";

test("it should be able to create a new slug from text", () => {
    const slug = Slug.createFromText("An example of text")
    expect(slug.text).toEqual("an-example-of-text")
})