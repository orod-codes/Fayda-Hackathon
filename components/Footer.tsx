"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Phone, Mail } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Image src="/images/hakim-ai-logo.png" alt="hakim-ai Logo" width={24} height={24} />
              </div>
              <span className="text-xl font-bold">Hakim AI</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your multilingual AI health assistant supporting English, Amharic, and Afaan Oromo. 
              Providing accessible healthcare information and support for Ethiopia.
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                HIPAA Compliant
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Heart className="h-3 w-3 mr-1" />
                Made with ❤️ for Ethiopia
              </Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start h-auto p-0">
                Health Chat
              </Button>
              <Button variant="ghost" className="w-full justify-start h-auto p-0">
                Medical History
              </Button>
              <Button variant="ghost" className="w-full justify-start h-auto p-0">
                Emergency Contacts
              </Button>
              <Button variant="ghost" className="w-full justify-start h-auto p-0">
                Health Tips
              </Button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Emergency & Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-destructive" />
                <span className="text-sm">Ambulance: 911</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-destructive" />
                <span className="text-sm">Police: 991</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-destructive" />
                <span className="text-sm">Fire: 939</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">support@hakim-ai.et</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 Hakim AI. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
} 