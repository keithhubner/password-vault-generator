"use client"

import { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, RefreshCw, Shield, Eye, EyeOff, Download, Trash2, Star, StarOff } from 'lucide-react'

interface PasswordEntry {
  id: string
  password: string
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  createdAt: Date
  isFavorite: boolean
  label?: string
}

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

const strengthColors = {
  weak: 'bg-red-500',
  medium: 'bg-orange-500',
  strong: 'bg-yellow-500',
  'very-strong': 'bg-green-500'
}

const strengthLabels = {
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
  'very-strong': 'Very Strong'
}

export default function PasswordVaultGenerator() {
  const [password, setPassword] = useState('')
  const [passwordHistory, setPasswordHistory] = useState<PasswordEntry[]>([])
  const [showPassword, setShowPassword] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  })

  // Load password history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('passwordHistory')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPasswordHistory(parsed.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt)
        })))
      } catch (error) {
        console.error('Failed to load password history:', error)
      }
    }
  }, [])

  // Save password history to localStorage whenever it changes
  useEffect(() => {
    if (passwordHistory.length > 0) {
      localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory))
    }
  }, [passwordHistory])

  const calculatePasswordStrength = useCallback((pwd: string): PasswordEntry['strength'] => {
    let score = 0
    
    // Length scoring
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (pwd.length >= 16) score += 1
    
    // Character variety scoring
    if (/[a-z]/.test(pwd)) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1
    
    // Pattern penalties
    if (/(.)\1{2,}/.test(pwd)) score -= 1 // Repeated characters
    if (/123|abc|qwe/i.test(pwd)) score -= 1 // Common sequences
    
    if (score <= 2) return 'weak'
    if (score <= 4) return 'medium'
    if (score <= 6) return 'strong'
    return 'very-strong'
  }, [])

  const generatePassword = useCallback(() => {
    let charset = ''
    
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (options.includeNumbers) charset += '0123456789'
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '')
    }
    
    if (options.excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\/\\'"~,;<>.]/g, '')
    }
    
    if (!charset) {
      alert('Please select at least one character type')
      return
    }
    
    let result = ''
    const array = new Uint8Array(options.length)
    crypto.getRandomValues(array)
    
    for (let i = 0; i < options.length; i++) {
      result += charset[array[i] % charset.length]
    }
    
    setPassword(result)
    
    // Add to history
    const newEntry: PasswordEntry = {
      id: crypto.randomUUID(),
      password: result,
      strength: calculatePasswordStrength(result),
      createdAt: new Date(),
      isFavorite: false
    }
    
    setPasswordHistory(prev => [newEntry, ...prev.slice(0, 49)]) // Keep last 50
  }, [options, calculatePasswordStrength])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const toggleFavorite = (id: string) => {
    setPasswordHistory(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
      )
    )
  }

  const deletePassword = (id: string) => {
    setPasswordHistory(prev => prev.filter(entry => entry.id !== id))
  }

  const exportPasswords = () => {
    const dataStr = JSON.stringify(passwordHistory, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `password-vault-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all password history?')) {
      setPasswordHistory([])
      localStorage.removeItem('passwordHistory')
    }
  }

  // Generate initial password on mount
  useEffect(() => {
    generatePassword()
  }, [])

  const favoritePasswords = passwordHistory.filter(entry => entry.isFavorite)
  const recentPasswords = passwordHistory.filter(entry => !entry.isFavorite)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Password Vault Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate secure, customizable passwords and manage your password vault with advanced options and history tracking.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Generator Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Password Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold">Generated Password</h2>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    readOnly
                    className="pr-24 text-lg font-mono bg-slate-50 dark:bg-slate-700 border-2 focus:border-blue-500 transition-colors"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(password)}
                      className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {password && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Strength:</span>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-20 rounded-full ${strengthColors[calculatePasswordStrength(password)]}`} />
                      <span className="text-sm font-medium capitalize">
                        {strengthLabels[calculatePasswordStrength(password)]}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={generatePassword} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate New Password
                  </Button>
                  {copySuccess && (
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      ✓ Copied!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Options Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h3 className="text-xl font-semibold mb-6">Password Options</h3>
              
              <div className="space-y-6">
                {/* Length Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">Password Length</Label>
                    <span className="text-lg font-bold text-blue-600">{options.length}</span>
                  </div>
                  <Slider
                    value={[options.length]}
                    onValueChange={(value) => setOptions(prev => ({ ...prev, length: value[0] }))}
                    max={128}
                    min={4}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>4</span>
                    <span>128</span>
                  </div>
                </div>

                {/* Character Types */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-base">Include Characters</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'includeUppercase', label: 'Uppercase (A-Z)', example: 'ABC' },
                        { key: 'includeLowercase', label: 'Lowercase (a-z)', example: 'abc' },
                        { key: 'includeNumbers', label: 'Numbers (0-9)', example: '123' },
                        { key: 'includeSymbols', label: 'Symbols (!@#)', example: '!@#' }
                      ].map(({ key, label, example }) => (
                        <div key={key} className="flex items-center space-x-3">
                          <Checkbox
                            id={key}
                            checked={options[key as keyof PasswordOptions] as boolean}
                            onCheckedChange={(checked) => 
                              setOptions(prev => ({ ...prev, [key]: checked }))
                            }
                          />
                          <Label htmlFor={key} className="flex-1 cursor-pointer">
                            {label}
                            <span className="text-xs text-muted-foreground ml-2 font-mono">
                              {example}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-base">Advanced Options</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'excludeSimilar', label: 'Exclude Similar', desc: 'i, l, 1, L, o, 0, O' },
                        { key: 'excludeAmbiguous', label: 'Exclude Ambiguous', desc: '{ } [ ] ( ) / \\ \' " ~' }
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-start space-x-3">
                          <Checkbox
                            id={key}
                            checked={options[key as keyof PasswordOptions] as boolean}
                            onCheckedChange={(checked) => 
                              setOptions(prev => ({ ...prev, [key]: checked }))
                            }
                            className="mt-1"
                          />
                          <Label htmlFor={key} className="flex-1 cursor-pointer">
                            {label}
                            <div className="text-xs text-muted-foreground mt-1 font-mono">
                              {desc}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password History Sidebar */}
          <div className="space-y-6">
            {/* History Controls */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Password Vault</h3>
                <span className="text-sm text-muted-foreground">
                  {passwordHistory.length} passwords
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportPasswords}
                  disabled={passwordHistory.length === 0}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  disabled={passwordHistory.length === 0}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Favorites */}
            {favoritePasswords.length > 0 && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Favorites ({favoritePasswords.length})
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {favoritePasswords.map((entry) => (
                    <PasswordHistoryItem
                      key={entry.id}
                      entry={entry}
                      onCopy={copyToClipboard}
                      onToggleFavorite={toggleFavorite}
                      onDelete={deletePassword}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recent Passwords */}
            {recentPasswords.length > 0 && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h4 className="font-semibold mb-4">
                  Recent Passwords ({recentPasswords.length})
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentPasswords.slice(0, 20).map((entry) => (
                    <PasswordHistoryItem
                      key={entry.id}
                      entry={entry}
                      onCopy={copyToClipboard}
                      onToggleFavorite={toggleFavorite}
                      onDelete={deletePassword}
                    />
                  ))}
                </div>
              </div>
            )}

            {passwordHistory.length === 0 && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 text-center">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Your password history will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface PasswordHistoryItemProps {
  entry: PasswordEntry
  onCopy: (password: string) => void
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
}

function PasswordHistoryItem({ entry, onCopy, onToggleFavorite, onDelete }: PasswordHistoryItemProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="group p-3 rounded-lg border bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${strengthColors[entry.strength]}`} />
          <span className="text-xs text-muted-foreground">
            {entry.createdAt.toLocaleDateString()} {entry.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite(entry.id)}
            className="h-6 w-6"
          >
            {entry.isFavorite ? 
              <Star className="h-3 w-3 text-yellow-500 fill-current" /> : 
              <StarOff className="h-3 w-3" />
            }
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(entry.id)}
            className="h-6 w-6 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <Input
            type={showPassword ? "text" : "password"}
            value={entry.password}
            readOnly
            className="h-8 text-xs font-mono bg-transparent border-0 p-1 focus:ring-0"
          />
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            className="h-6 w-6"
          >
            {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCopy(entry.password)}
            className="h-6 w-6"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}