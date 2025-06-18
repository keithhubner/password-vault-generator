export class PerformanceMonitor {
  private startTime: number = 0
  private endTime: number = 0
  
  start(): void {
    this.startTime = performance.now()
  }
  
  end(): number {
    this.endTime = performance.now()
    return this.endTime - this.startTime
  }
  
  getDuration(): number {
    return this.endTime - this.startTime
  }
  
  static measure<T>(fn: () => T, label?: string): { result: T; duration: number } {
    const monitor = new PerformanceMonitor()
    monitor.start()
    const result = fn()
    const duration = monitor.end()
    
    if (label && typeof window !== 'undefined' && window.console) {
      console.log(`${label}: ${duration.toFixed(2)}ms`)
    }
    
    return { result, duration }
  }
  
  static async measureAsync<T>(fn: () => Promise<T>, label?: string): Promise<{ result: T; duration: number }> {
    const monitor = new PerformanceMonitor()
    monitor.start()
    const result = await fn()
    const duration = monitor.end()
    
    if (label && typeof window !== 'undefined' && window.console) {
      console.log(`${label}: ${duration.toFixed(2)}ms`)
    }
    
    return { result, duration }
  }
}

export const memoryUsage = (): number => {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory
    return memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
  }
  return 0
}

export const logMemoryUsage = (label: string): void => {
  const usage = memoryUsage()
  if (usage > 0) {
    console.log(`${label}: ${usage.toFixed(2)}MB`)
  }
}