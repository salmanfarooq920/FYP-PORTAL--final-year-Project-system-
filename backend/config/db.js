import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      w: 'majority',
      directConnection: false,
      tls: true,
      tlsInsecure: false,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Error Code:', error.code);
    
    // If SRV fails, try alternative connection
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  SRV DNS record resolution failed.');
      console.error('\nSOLUTION: Get the standard connection string from MongoDB Atlas:');
      console.error('1. Go to MongoDB Atlas Dashboard');
      console.error('2. Click "Connect" on your cluster');
      console.error('3. Choose "Connect your application"');
      console.error('4. Select "Driver: Node.js" and "Version: 5.5 or later"');
      console.error('5. Copy the connection string (it starts with mongodb+srv://)');
      console.error('6. If DNS issues persist, click "I don\'t have the mongo shell installed"');
      console.error('   to get the standard connection string (starts with mongodb://)');
      console.error('\nAlternatively, add Google DNS to your network adapter:');
      console.error('- Primary DNS: 8.8.8.8');
      console.error('- Secondary DNS: 8.8.4.4');
    } else {
      console.error('\nTroubleshooting steps:');
      console.error('1. Check your MongoDB Atlas Network Access settings');
      console.error('2. Add your IP address (0.0.0.0/0 for all IPs) in Atlas');
      console.error('3. Verify your DNS settings and internet connection');
      console.error('4. Check if MongoDB Atlas cluster is running');
    }
    
    console.log('\nRetrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};
