import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/ui/navigation";

const DMCA = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">DMCA Policy</h1>
          <p className="text-muted-foreground text-lg">
            Digital Millennium Copyright Act Notice & Takedown Policy
          </p>
        </header>

        <Card className="p-8">
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Copyright Policy</h2>
              <p className="text-muted-foreground">
                BlogSpace respects the intellectual property rights of others and expects our users 
                to do the same. We will respond to clear notices of alleged copyright infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Filing a DMCA Notice</h2>
              <p className="text-muted-foreground">
                If you believe your copyrighted work has been copied in a way that constitutes 
                copyright infringement, please provide our designated agent with the following information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
                <li>A physical or electronic signature of the copyright owner</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the material that is claimed to be infringing</li>
                <li>Your contact information</li>
                <li>A statement of good faith belief that the use is not authorized</li>
                <li>A statement that the information is accurate and you are authorized to act</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Designated Agent</h2>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>DMCA Agent</strong><br />
                  BlogSpace Legal Department<br />
                  Email: dmca@blogspace.com<br />
                  Address: 123 Blog Street, Digital City, DC 12345
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Counter-Notification</h2>
              <p className="text-muted-foreground">
                If you believe your content was removed by mistake or misidentification, you may 
                file a counter-notification with our designated agent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Repeat Infringers</h2>
              <p className="text-muted-foreground">
                BlogSpace will terminate user accounts of repeat infringers in appropriate circumstances.
              </p>
            </section>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default DMCA;