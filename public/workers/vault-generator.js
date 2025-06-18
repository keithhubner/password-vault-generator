// Web Worker for vault generation to prevent UI blocking
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  if (type === 'GENERATE_VAULT') {
    try {
      // Simulate processing for demonstration
      // In a real implementation, you would import the actual generation logic
      const { totalItems } = data;
      
      for (let i = 0; i <= totalItems; i += Math.floor(totalItems / 20) || 1) {
        // Send progress updates
        self.postMessage({
          type: 'PROGRESS',
          data: {
            current: Math.min(i, totalItems),
            total: totalItems,
            status: i === totalItems ? 'Complete!' : 'Processing...'
          }
        });
        
        // Simulate processing time
        if (i < totalItems) {
          // Use a simple delay for demonstration
          const start = Date.now();
          while (Date.now() - start < 50) {
            // Simulate work
          }
        }
      }
      
      self.postMessage({
        type: 'COMPLETE',
        data: { message: 'Generation complete' }
      });
      
    } catch (error) {
      self.postMessage({
        type: 'ERROR',
        data: { message: error.message }
      });
    }
  }
};

self.onerror = function(error) {
  self.postMessage({
    type: 'ERROR',
    data: { message: 'Worker error: ' + error.message }
  });
};