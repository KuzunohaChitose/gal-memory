import { sqlQuery } from "@/apis";

const fibonacciNb = (n: number, sum: number = 0, last: number = 1): number =>
    n === 0 ? sum : fibonacciNb(n - 1, last, sum + last);

test("Test", async () => {});
