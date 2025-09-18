import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <Card className="p-8">
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies</h2>
              <p className="text-muted-foreground">
                Cookies are small text files that are placed on your computer or mobile device 
                when you visit our website. They help us provide you with a better experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Cookies</h2>
              <p className="text-muted-foreground">
                We use cookies to remember your preferences, keep you signed in, analyze site usage, 
                and provide personalized content and advertisements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Cookies</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">Essential Cookies</h3>
                  <p className="text-muted-foreground">Required for the website to function properly.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Analytics Cookies</h3>
                  <p className="text-muted-foreground">Help us understand how visitors interact with our website.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Preference Cookies</h3>
                  <p className="text-muted-foreground">Remember your settings and preferences.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground">
                You can control and manage cookies through your browser settings. Note that 
                disabling cookies may affect the functionality of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about our use of cookies, please contact us at 
                cookies@blogspace.com.
              </p>
            </section>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Cookies;