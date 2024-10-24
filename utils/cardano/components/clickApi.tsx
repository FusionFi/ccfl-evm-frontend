import { getExchangeRate } from "@/utils/api/getExchangeRate";

export function ClickApi() {
  const handleButtonClick = async () => {
    try {
      const res = await getExchangeRate('cardano');
      console.log(res);
      return;
      // setTxHash(res); // Assuming res is a string, adjust if necessary
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  return (
    <div className="bg-teal-500 px-6 py-1 text-base border rounded-md right-2 top-2 border-primary/20">
      <button onClick={handleButtonClick}>API Test</button>
    </div>
  );
}