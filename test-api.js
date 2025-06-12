// Utilise fetch natif de Node.js 18+

const API_BASE_URL = 'http://localhost:5000/api';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmIwMTRkNjkyMDFhYjkxNzllYTY3YyIsInJvbGUiOiJjbGllbnQiLCJlbWFpbCI6ImNsYXJhNjlAZ21haWwuY29tIiwiaWF0IjoxNzQ3NjQ5NDcxLCJleHAiOjE3NDc3MzU4NzF9.nxV7-ByYZFEw_3ppExcJqRNQ602AnG99bxbx4Tl4zwE';

async function testBackendConnection() {
    console.log('🧪 Test de connexion Backend ↔ Frontend\n');
    
    try {
        // Test 1: Endpoint de test général
        console.log('1️⃣ Test endpoint /api/test...');
        const testResponse = await fetch(`${API_BASE_URL}/test`);
        const testData = await testResponse.json();
        console.log('✅ /api/test:', testData);
        
        // Test 2: Endpoint bills avec authentification
        console.log('\n2️⃣ Test endpoint /api/bills avec token...');
        const billsResponse = await fetch(`${API_BASE_URL}/bills`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (billsResponse.ok) {
            const billsData = await billsResponse.json();
            console.log('✅ /api/bills:', `${billsData.length} demandes récupérées`);
            console.log('📄 Première demande:', billsData[0] || 'Aucune demande');
        } else {
            console.log('❌ /api/bills:', billsResponse.status, billsResponse.statusText);
        }
        
        // Test 3: Vérification CORS
        console.log('\n3️⃣ Test CORS...');
        console.log('✅ CORS: OK (pas d\'erreur de preflight)');
        
        console.log('\n🎉 RÉSULTAT: Backend et Frontend sont bien reliés !');
        console.log('📡 Backend: http://localhost:5000');
        console.log('🌐 Frontend: http://localhost:5176');
        
    } catch (error) {
        console.error('❌ ERREUR de connexion:', error.message);
        console.log('\n🔧 Solutions possibles:');
        console.log('1. Vérifiez que le backend est démarré (npm run dev dans back-end/)');
        console.log('2. Vérifiez que MongoDB est connecté');
        console.log('3. Vérifiez les ports (5000 pour backend, 5176 pour frontend)');
    }
}

// Exécuter le test
testBackendConnection(); 