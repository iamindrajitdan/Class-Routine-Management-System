async function test() {
    try {
        const loginRes = await fetch('http://localhost:8080/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@crms.edu', password: 'password123' })
        });
        const loginData = await loginRes.json();
        console.log("Login Status:", loginRes.status);
        if (!loginData.accessToken) {
            console.log("No token", loginData);
            return;
        }

        const token = loginData.accessToken;
        console.log("Logged in. Token:", token.substring(0, 20) + "...");

        const refRes = await fetch('http://localhost:8080/api/v1/reference-data', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const refData = await refRes.json();

        console.log("Ref Res Status:", refRes.status);
        console.log("Reference Data Keys:", Object.keys(refData));
        console.log("Is classes array?", Array.isArray(refData.classes));
        if (refRes.status !== 200) {
            console.log("Error body:", refData);
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
}

test();
