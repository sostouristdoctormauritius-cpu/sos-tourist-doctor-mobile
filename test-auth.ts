import { authHelpers, dbHelpers } from './lib/supabase';

async function testAuthentication() {
  console.log('🔐 Testing Supabase Authentication Setup...\n');

  try {
    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing Supabase connection...');
    const { session, error: sessionError } = await authHelpers.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
    } else {
      console.log('✅ Supabase connection successful');
      console.log('Current session:', session ? 'Active' : 'None');
    }

    // Test 2: Test login with demo credentials
    console.log('\n2. Testing login with demo credentials...');
    const { data, error } = await authHelpers.signInWithPassword(
      'dr.smith@example.com',
      'doctor123'
    );

    if (error) {
      console.error('❌ Login failed:', error.message);
      console.log('Make sure you have:');
      console.log('- Created the auth user in Supabase Auth dashboard');
      console.log('- Set the password to "doctor123"');
      console.log('- Run the database-setup.sql script');
    } else {
      console.log('✅ Login successful');
      console.log('User ID:', data.session?.user?.id);
      console.log('Email:', data.session?.user?.email);

      // Test 3: Fetch doctor profile
      console.log('\n3. Testing doctor profile fetch...');
      const { data: doctorData, error: doctorError } = await dbHelpers.getDoctorByEmail(
        data.session?.user?.email!
      );

      if (doctorError) {
        console.error('❌ Doctor profile fetch failed:', doctorError);
        console.log('Make sure you have run the database-setup.sql script');
      } else if (doctorData) {
        console.log('✅ Doctor profile found');
        console.log('Name:', `${doctorData.firstName} ${doctorData.lastName}`);
        console.log('Specialization:', doctorData.specialization);
        console.log('Verified:', doctorData.verified);
      } else {
        console.log('❌ No doctor profile found for this user');
      }

      // Test 4: Sign out
      console.log('\n4. Testing sign out...');
      const { error: signOutError } = await authHelpers.signOut();
      
      if (signOutError) {
        console.error('❌ Sign out failed:', signOutError);
      } else {
        console.log('✅ Sign out successful');
      }
    }

  } catch (error) {
    console.error('❌ Test failed with exception:', error);
  }

  console.log('\n🏁 Authentication test completed');
}

// Run the test
testAuthentication();