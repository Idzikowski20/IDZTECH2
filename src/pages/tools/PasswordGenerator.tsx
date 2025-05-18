
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Copy, RefreshCw, Check } from "lucide-react";
import PageDotAnimation from "@/components/PageDotAnimation";
import PasswordStrengthIndicator from "@/components/ui/PasswordStrengthIndicator";
import { useTranslation } from 'react-i18next';

// List of common syllables to create pronounceable passwords
const SYLLABLES = [
  "ba", "be", "bi", "bo", "bu", "ca", "ce", "ci", "co", "cu", "da", "de", "di", "do", 
  "du", "fa", "fe", "fi", "fo", "fu", "ga", "ge", "gi", "go", "gu", "ha", "he", "hi", 
  "ho", "hu", "ja", "je", "ji", "jo", "ju", "ka", "ke", "ki", "ko", "ku", "la", "le", 
  "li", "lo", "lu", "ma", "me", "mi", "mo", "mu", "na", "ne", "ni", "no", "nu", "pa", 
  "pe", "pi", "po", "pu", "ra", "re", "ri", "ro", "ru", "sa", "se", "si", "so", "su", 
  "ta", "te", "ti", "to", "tu", "va", "ve", "vi", "vo", "vu", "wa", "we", "wi", "wo", 
  "wu", "xa", "xe", "xi", "xo", "xu", "ya", "ye", "yi", "yo", "yu", "za", "ze", "zi", 
  "zo", "zu", "cha", "che", "chi", "cho", "chu", "tha", "the", "thi", "tho", "thu"
];

// List of meaningful word parts to make passwords easier to remember
const WORD_PARTS = [
  "eco", "bio", "geo", "neo", "tech", "link", "wave", "flex", "flow", "byte",
  "data", "info", "meta", "sync", "grid", "node", "pixel", "cloud", "craft",
  "smart", "fast", "secure", "bright", "quick", "swift", "solid", "fluent",
  "rapid", "vital", "prime", "logic", "cyber", "digit", "boost", "power",
  "spark", "vista", "focus", "pulse", "scope", "trend", "level", "scale",
  "shift", "nexus", "orbit", "space", "drive", "fresh", "ideal", "major"
];

// List of common words to include in passwords
const COMMON_WORDS = [
  "time", "year", "team", "work", "life", "good", "blue", "book", "home", 
  "view", "card", "lock", "file", "safe", "port", "code", "note", "link",
  "plan", "key", "pass", "word", "user", "path", "sign", "door", "net",
  "web", "site", "flow", "task", "form", "line", "goal", "mind", "idea"
];

const PASSWORD_TYPES = {
  MEMORABLE: 'memorable',
  PRONOUNCEABLE: 'pronounceable',
  RANDOM: 'random'
};

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [passwordType, setPasswordType] = useState(PASSWORD_TYPES.MEMORABLE);
  const { t } = useTranslation();
  
  // Generate password on mount and when options change
  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeNumbers, includeSymbols, passwordType]);

  // Function to generate pronounceable password based on syllables
  const generatePronounceablePassword = (targetLength: number): string => {
    let result = '';
    
    // Add syllables until we reach desired length
    while (result.length < targetLength) {
      // Add a syllable
      const syllable = SYLLABLES[Math.floor(Math.random() * SYLLABLES.length)];
      result += syllable;
      
      // Randomly capitalize if option is enabled
      if (includeUppercase && Math.random() > 0.7) {
        const lastIndex = result.length - 1;
        result = result.substring(0, lastIndex) + result.charAt(lastIndex).toUpperCase();
      }
    }
    
    // Trim to exact length
    result = result.substring(0, targetLength);
    
    // Add numbers and symbols if needed
    if (includeNumbers || includeSymbols) {
      // Replace some characters with numbers or symbols
      const charToReplace = Math.min(Math.floor(targetLength * 0.3), 4); // Replace up to 30% of chars, max 4
      
      for (let i = 0; i < charToReplace; i++) {
        const position = Math.floor(Math.random() * result.length);
        const char = result.charAt(position);
        
        // Try to replace with a symbol or number that looks similar to the letter
        if (includeNumbers) {
          if (['a', 'A'].includes(char)) result = replaceAt(result, position, '4');
          else if (['e', 'E'].includes(char)) result = replaceAt(result, position, '3');
          else if (['i', 'I'].includes(char)) result = replaceAt(result, position, '1');
          else if (['o', 'O'].includes(char)) result = replaceAt(result, position, '0');
          else if (includeNumbers && Math.random() > 0.5) {
            result = replaceAt(result, position, String(Math.floor(Math.random() * 10)));
          }
        }
        
        if (includeSymbols && Math.random() > 0.7) {
          const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
          result = replaceAt(result, position, symbols.charAt(Math.floor(Math.random() * symbols.length)));
        }
      }
    }
    
    return result;
  };

  // Function to replace a character in a string at a specific position
  const replaceAt = (str: string, index: number, replacement: string): string => {
    return str.substring(0, index) + replacement + str.substring(index + 1);
  };

  // Generate a memorable password using common words and modifications
  const generateMemorablePassword = (targetLength: number): string => {
    let result = '';
    const words = [...COMMON_WORDS, ...WORD_PARTS];
    
    // Add words until we get close to desired length
    while (result.length < targetLength - 4) {
      // Add a word
      const word = words[Math.floor(Math.random() * words.length)];
      
      // Apply some random capitalization if enabled
      if (includeUppercase && Math.random() > 0.5) {
        if (Math.random() > 0.7) {
          // Capitalize the whole word
          result += word.toUpperCase();
        } else {
          // Capitalize first letter
          result += word.charAt(0).toUpperCase() + word.slice(1);
        }
      } else {
        result += word;
      }
      
      // Add a separator between words
      if (includeSymbols && Math.random() > 0.3) {
        const separators = ['_', '-', '.', '+', '='];
        result += separators[Math.floor(Math.random() * separators.length)];
      } else if (includeNumbers) {
        if (Math.random() > 0.6) {
          result += String(Math.floor(Math.random() * 100));
        }
      }
    }
    
    // Trim to exact length or pad if needed
    if (result.length > targetLength) {
      result = result.substring(0, targetLength);
    } else if (result.length < targetLength) {
      const missing = targetLength - result.length;
      // Add some numbers or symbols at the end
      for (let i = 0; i < missing; i++) {
        if (includeNumbers && includeSymbols) {
          const chars = '0123456789!@#$%^&*';
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        } else if (includeNumbers) {
          result += String(Math.floor(Math.random() * 10));
        } else if (includeSymbols) {
          const symbols = '!@#$%^&*()_+-=';
          result += symbols.charAt(Math.floor(Math.random() * symbols.length));
        } else {
          result += SYLLABLES[Math.floor(Math.random() * SYLLABLES.length)];
        }
      }
    }
    
    return result;
  };

  // Generate random password (classical approach)
  const generateRandomPassword = (targetLength: number): string => {
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = lowerCaseChars;
    if (includeUppercase) chars += upperCaseChars;
    if (includeNumbers) chars += numberChars;
    if (includeSymbols) chars += symbolChars;
    
    let result = '';
    
    // Ensure password contains at least one of each required character type
    if (includeUppercase) {
      result += upperCaseChars.charAt(Math.floor(Math.random() * upperCaseChars.length));
    }
    if (includeNumbers) {
      result += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    }
    if (includeSymbols) {
      result += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
    }
    
    // Fill the rest randomly
    for (let i = result.length; i < targetLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Shuffle the result to make it more random
    return result.split('').sort(() => 0.5 - Math.random()).join('');
  };

  const generatePassword = () => {
    let newPassword = '';
    
    switch(passwordType) {
      case PASSWORD_TYPES.PRONOUNCEABLE:
        newPassword = generatePronounceablePassword(length);
        break;
      case PASSWORD_TYPES.MEMORABLE:
        newPassword = generateMemorablePassword(length);
        break;
      case PASSWORD_TYPES.RANDOM:
        newPassword = generateRandomPassword(length);
        break;
      default:
        newPassword = generateMemorablePassword(length);
    }
    
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
      .then(() => {
        setCopied(true);
        toast.success("Password copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error("Failed to copy password");
      });
  };

  return (
    <div className="min-h-screen bg-premium-dark">
      <Navbar />
      <PageDotAnimation />

      <div className="container px-4 max-w-4xl mx-auto py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Password Generator</h1>
          <p className="text-premium-light/70 text-lg max-w-2xl mx-auto">
            Create secure and customizable passwords for your accounts. 
            Choose between memorable, pronounceable, or completely random passwords.
          </p>
        </div>

        <div className="bg-premium-dark/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center mb-6 gap-4">
            <div className="w-full">
              <Input
                value={password}
                readOnly
                className="bg-premium-dark/80 h-14 text-xl border-white/20 focus-visible:ring-purple-500/30"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                className="min-w-[100px] bg-premium-gradient hover:opacity-90 transition-opacity"
              >
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                onClick={generatePassword}
                variant="outline"
                className="border-white/20 hover:bg-white hover:text-black"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Generate</span>
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <PasswordStrengthIndicator password={password} />
          </div>

          <div className="space-y-8">
            {/* Password Type Selection */}
            <div>
              <h2 className="text-lg font-medium mb-4">Password Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  onClick={() => setPasswordType(PASSWORD_TYPES.MEMORABLE)}
                  variant={passwordType === PASSWORD_TYPES.MEMORABLE ? "default" : "outline"}
                  className={`${
                    passwordType === PASSWORD_TYPES.MEMORABLE 
                      ? "bg-premium-gradient hover:opacity-90"
                      : "border-white/20 hover:bg-white/10"
                  }`}
                >
                  Memorable
                </Button>
                <Button
                  onClick={() => setPasswordType(PASSWORD_TYPES.PRONOUNCEABLE)}
                  variant={passwordType === PASSWORD_TYPES.PRONOUNCEABLE ? "default" : "outline"}
                  className={`${
                    passwordType === PASSWORD_TYPES.PRONOUNCEABLE
                      ? "bg-premium-gradient hover:opacity-90"
                      : "border-white/20 hover:bg-white/10"
                  }`}
                >
                  Pronounceable
                </Button>
                <Button
                  onClick={() => setPasswordType(PASSWORD_TYPES.RANDOM)}
                  variant={passwordType === PASSWORD_TYPES.RANDOM ? "default" : "outline"}
                  className={`${
                    passwordType === PASSWORD_TYPES.RANDOM
                      ? "bg-premium-gradient hover:opacity-90"
                      : "border-white/20 hover:bg-white/10"
                  }`}
                >
                  Random
                </Button>
              </div>
            </div>

            {/* Password Length */}
            <div>
              <div className="flex justify-between mb-2">
                <h2 className="text-lg font-medium">Password Length</h2>
                <span className="text-premium-light/70">{length} characters</span>
              </div>
              <Slider 
                value={[length]}
                min={8}
                max={32}
                step={1}
                onValueChange={(val) => setLength(val[0])}
                className="my-4"
              />
            </div>

            {/* Options */}
            <div>
              <h2 className="text-lg font-medium mb-4">Options</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-premium-light/70">Include Uppercase Letters</label>
                  <Switch 
                    checked={includeUppercase}
                    onCheckedChange={setIncludeUppercase}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-premium-light/70">Include Numbers</label>
                  <Switch 
                    checked={includeNumbers}
                    onCheckedChange={setIncludeNumbers}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-premium-light/70">Include Symbols</label>
                  <Switch 
                    checked={includeSymbols}
                    onCheckedChange={setIncludeSymbols}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-premium-dark/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Password Tips</h2>
          <ul className="space-y-2 text-premium-light/70">
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">•</span> Use a unique password for each account
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">•</span> Consider using a password manager to store your passwords securely
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">•</span> The longer your password, the more secure it will be
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">•</span> Avoid using personal information in your passwords
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-2">•</span> Enable two-factor authentication when available for additional security
            </li>
          </ul>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PasswordGenerator;
