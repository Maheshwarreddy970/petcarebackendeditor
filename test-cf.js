// test-cf.js
const email = "harishwarr260@gmail.com";
const zoneId = "12f9430d443141a3c114f15a2da2f3b2"; 

// 🛑 REPLACE THIS WITH YOUR 37-CHARACTER GLOBAL API KEY
// Go to Cloudflare -> My Profile -> API Tokens -> Scroll to bottom -> "Global API Key" -> View
const globalApiKey = "cfk_ORL7huVR2Sz6XLYGXmJKevmLU7TKlRX7VfOlArmK96730bd4"; 

async function testCloudflare() {
  console.log("Testing Cloudflare Connection...");
  
  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/custom_hostnames`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Email": email,
      "X-Auth-Key": globalApiKey
    }
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

testCloudflare();