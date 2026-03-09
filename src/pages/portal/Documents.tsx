import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, FileText, ShieldCheck, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface DocItem {
  icon: React.ElementType;
  title: string;
  description: string;
  available: boolean;
  action?: { label: string; href: string; external?: boolean };
}

const DOCUMENTS: DocItem[] = [
  {
    icon: FileDown,
    title: "Service Agreement (PDF)",
    description:
      "Your personalised service agreement including covered property address, policy number, coverage items, and claim instructions.",
    available: true,
    action: { label: "Go to Overview", href: "/portal/dashboard" },
  },
  {
    icon: ShieldCheck,
    title: "Coverage Summary",
    description:
      "A plain-English overview of what ProGuard covers, what is excluded, and the limits that apply to your plan.",
    available: false,
  },
  {
    icon: BookOpen,
    title: "Claims Guide",
    description:
      "Step-by-step instructions for filing a claim, what to expect from the dispatch process, and how direct payment works.",
    available: true,
    action: { label: "View Claims Page", href: "/portal/claim" },
  },
  {
    icon: FileText,
    title: "Annual Renewal Notice",
    description:
      "Your most recent renewal notice, premium confirmation, and coverage effective dates for the current term.",
    available: false,
  },
];

function DocCard({ doc }: { doc: DocItem }) {
  const Icon = doc.icon;
  return (
    <Card className="border-border flex flex-col">
      <CardContent className="pt-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-[#1B5E3B]/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-[#1B5E3B]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-foreground">{doc.title}</p>
              {!doc.available && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  Coming Soon
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{doc.description}</p>
          </div>
        </div>

        {doc.action && doc.available && (
          <div className="mt-auto pt-3 border-t border-border">
            {doc.action.external ? (
              <Button variant="outline" size="sm" className="w-full gap-2 text-sm" asChild>
                <a href={doc.action.href} target="_blank" rel="noopener noreferrer">
                  <FileDown className="h-3.5 w-3.5" />
                  {doc.action.label}
                </a>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="w-full gap-2 text-sm" asChild>
                <Link to={doc.action.href}>
                  <FileDown className="h-3.5 w-3.5" />
                  {doc.action.label}
                </Link>
              </Button>
            )}
          </div>
        )}

        {!doc.available && (
          <div className="mt-auto pt-3 border-t border-border flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Available in a future update
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Documents() {
  return (
    <PortalLayout>
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-foreground">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Access your policy documents, coverage summaries, and guides.
          </p>
        </div>

        {/* Document grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {DOCUMENTS.map((doc) => (
            <DocCard key={doc.title} doc={doc} />
          ))}
        </div>

        {/* Note */}
        <Card className="border-border bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Need a specific document?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you need a copy of a document not listed here, contact our support team at{" "}
              <a
                href="mailto:support@proguardplans.com"
                className="text-[#1B5E3B] font-medium hover:underline"
              >
                support@proguardplans.com
              </a>{" "}
              and we&apos;ll get it to you within one business day.
            </p>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
