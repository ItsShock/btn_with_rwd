const Differencify = require("differencify");
const differencify = new Differencify({ mismatchThreshold: 0 });
let urlToTest = "http://127.0.0.1:8080/";

describe("Zadanie", () => {
  const timeout = 30000;
  let page;

  beforeAll(async () => {
    await differencify.launchBrowser({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const target = differencify.init({ chain: false });
    page = await target.newPage();
    await page.goto(urlToTest);
    await page.waitFor(1000);
  }, timeout);
  afterAll(async () => {
    await differencify.cleanup();
  });

  it("Wyświetla nawigację z odpowiednio ustawionym stylem", async () => {
    await page.setViewport({width: 1600, height: 600})
    const nav = await page.$eval("nav", elem => {
      return getComputedStyle(elem).display === "flex"
        && getComputedStyle(elem).justifyContent === "space-between";
    });
    expect(nav).toBe(true);
  }, timeout);

  it("Wyświetla link z nazwą firmy", async () => {
    const section = await page.$eval("nav > a", elem => !!elem);
    expect(section).toBe(true);
  }, timeout);

  it("Wyświetla div z linkami dla dużych rozdzielczości", async () => {
    const links = await page.$$eval("nav div a", elems => elems.length > 1);
    expect(links).toBe(true);
  }, timeout);

  it("Ukrywa div z linkami dla małych rozdzielczości (mobile menu)", async () => {
    await page.setViewport({width: 500, height: 600})
    const links = await page.$eval("nav div", elem => {
      return getComputedStyle(elem).display === "none";
    });
    expect(links).toBe(true);
  }, timeout);

  it("Wyświetla button z obrazkiem dla małych rozdzielczości (mobile menu)", async () => {
    await page.setViewport({width: 500, height: 600})
    const button = await page.$eval("nav button", elem => {
      return getComputedStyle(elem).display === "block";
    });
    expect(button).toBe(true);
  }, timeout);
});
