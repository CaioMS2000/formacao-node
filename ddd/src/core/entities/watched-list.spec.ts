import { WatchedList } from "./watched-list";

class NumberWatchedList extends WatchedList<number> {
	compareItems(a: number, b: number): boolean {
		return a === b;
	}
}

describe("WatchedList", () => {
	it("should be able to create a watched list with initial items", () => {
		const watchedList = new NumberWatchedList([1, 2, 3]);

        expect(watchedList.currentItems).toHaveLength(3);
        expect(watchedList.getItems()).to.deep.equal([1, 2, 3]);
	});

	it("should be able to add new itens to watched list", () => {
		const watchedList = new NumberWatchedList([1, 2, 3]);

        watchedList.add(4);

        expect(watchedList.currentItems).toHaveLength(4);
        expect(watchedList.getNewItems()).to.deep.equal([4]);
	});

	it("should be able to remove itens from watched list", () => {
		const watchedList = new NumberWatchedList([1, 2, 3, 4, 5]);

        watchedList.remove(2);

        expect(watchedList.currentItems).toHaveLength(4);
        expect(watchedList.getRemovedItems()).to.deep.equal([2]);
	});
});
