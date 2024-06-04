export class Slug {
	public text: string;

	constructor(text: string) {
		this.text = text;
	}

	static createFromText(text: string) {
		const slugText = text
			.normalize("NFKD")
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/_/g, "-")
			.replace(/--+/g, "-")
			.replace(/-$/g, "")
        
        return new Slug(slugText)
	}
}
