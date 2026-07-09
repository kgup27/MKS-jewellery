import { FiSearch } from "react-icons/fi";

const categories = [
  "All",
  "Rings",
  "Necklace",
  "Earrings",
  "Bangles",
  "Bracelet",
  "Studs",
];

const sortOptions = [
  "Newest",
  "Price Low → High",
  "Price High → Low",
  "Top Rated",
];

function ShopToolbar({
  search,
  setSearch,
  category,
  setCategory,
  sortBy,
  setSortBy,
}) {
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("Newest");
  };

  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Search + Sort */}
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          {/* Search */}
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search jewellery..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-[#C9A227]"
            />
          </div>

          {/* Sort + Clear */}
          <div className="flex flex-wrap gap-4">

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-300 px-5 py-3 outline-none transition focus:border-[#C9A227]"
            >
              {sortOptions.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              onClick={clearFilters}
              className="rounded-xl border border-red-500 px-5 py-3 text-red-500 transition hover:bg-red-500 hover:text-white"
            >
              Clear Filters
            </button>

          </div>
        </div>

        {/* Categories */}
        <div className="mt-8 flex flex-wrap gap-4">

          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-6 py-2 transition-all duration-300 ${
                category === item
                  ? "bg-[#C9A227] text-white shadow-lg"
                  : "border border-gray-300 hover:border-[#C9A227] hover:text-[#C9A227]"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

      </div>
    </section>
  );
}

export default ShopToolbar;