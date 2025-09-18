import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <Card className="p-8">
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using BlogSpace, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">User Content</h2>
              <p className="text-muted-foreground">
                You retain ownership of content you post on BlogSpace. By posting content, you grant 
                us a non-exclusive, worldwide, royalty-free license to use, display, and distribute 
                your content on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Prohibited Uses</h2>
              <p className="text-muted-foreground">
                You may not use our service for any unlawful purpose, to transmit harmful content, 
                or to harass other users. We reserve the right to terminate accounts that violate 
                these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                BlogSpace shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground">
                Questions about the Terms of Service should be sent to us at legal@blogspace.com.
              </p>
            </section>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Terms;