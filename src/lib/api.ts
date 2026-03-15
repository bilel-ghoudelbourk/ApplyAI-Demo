const MOCK_DELAY = 650;

export const AVAILABLE_SEARCH_SOURCES = [
    "professional_network",
    "recruitment_site",
    "tech_job_portal",
    "job_search_engine",
    "public_employment_service",
    "executive_job_board",
] as const;

export function getSearchSourceLabel(source: string, language: string) {
    const labels: Record<string, { fr: string; en: string }> = {
        professional_network: {
            fr: "Reseau professionnel",
            en: "Professional network",
        },
        recruitment_site: {
            fr: "Site de recrutement",
            en: "Recruitment site",
        },
        tech_job_portal: {
            fr: "Portail emploi",
            en: "Job portal",
        },
        job_search_engine: {
            fr: "Moteur d'offres",
            en: "Job search engine",
        },
        public_employment_service: {
            fr: "Service public emploi",
            en: "Public employment service",
        },
        executive_job_board: {
            fr: "Site emploi cadres",
            en: "Executive job board",
        },
    };

    const key = normalize(source);
    return labels[key]?.[language === "fr" ? "fr" : "en"] ?? source;
}

export type JobListing = {
    source: string;
    title: string;
    company: string;
    location: string;
    url: string;
    posted_at_text?: string | null;
    summary?: string | null;
};

export type MatchListingData = {
    source?: string;
    title?: string;
    company?: string;
    location?: string;
    url?: string;
    posted_at_text?: string | null;
    summary?: string | null;
    analysis_source?: string;
    job_title?: string;
    job_company?: string;
    job_required_skills?: string[];
    job_description?: string;
    match_score?: number;
    missing_skills?: string[];
    reasoning?: string;
    analysis_error?: string;
};

export type AnalyzeMatchData = {
    cv_skills?: string[];
    job_title?: string;
    job_company?: string;
    job_location?: string;
    job_required_skills?: string[];
    match_score?: number;
    missing_skills?: string[];
    reasoning?: string;
};

export type CVMetadata = {
    location: string | null;
    job_title: string | null;
    top_skills: string[];
    suggested_keywords: string;
};

export type DiscoveryResponse = {
    status: string;
    data: {
        results: JobListing[];
        errors: Record<string, string>;
    };
};

type JobListingPayload = Partial<JobListing>;

type MockData = {
    match_result: MatchListingData & AnalyzeMatchData;
    cover_letter: string;
    search_results: JobListing[];
    cv_metadata?: CVMetadata;
};

const DEFAULT_CV_METADATA: CVMetadata = {
    location: "France",
    job_title: "Ingenieur IA",
    top_skills: ["Python", "RAG", "LangChain", "React", "Docker", "Azure"],
    suggested_keywords: "Ingenieur IA",
};

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadMockData(): Promise<MockData> {
    const response = await fetch("/mock-data.json", { cache: "no-store" });
    if (!response.ok) {
        throw new Error("Failed to load mock data");
    }

    const payload = (await response.json()) as MockData;
    return {
        ...payload,
        cv_metadata: payload.cv_metadata ?? DEFAULT_CV_METADATA,
    };
}

function normalize(value: string | null | undefined) {
    return (value ?? "").trim().toLowerCase();
}

function matchesQuery(listing: JobListing, keywords: string, location: string) {
    const haystack = [listing.title, listing.company, listing.summary, listing.source].join(" ").toLowerCase();
    const locationHaystack = listing.location.toLowerCase();
    const keywordQuery = normalize(keywords);
    const locationQuery = normalize(location);

    const keywordMatch = !keywordQuery || haystack.includes(keywordQuery);
    const locationMatch = !locationQuery || locationHaystack.includes(locationQuery);

    return keywordMatch && locationMatch;
}

function filterListings(
    listings: JobListing[],
    keywords: string,
    location: string,
    sources: string[],
    limit: number,
): JobListing[] {
    const normalizedSources = sources.map((source) => normalize(source)).filter(Boolean);

    return listings
        .filter((listing) => {
            if (normalizedSources.length > 0 && !normalizedSources.includes(normalize(listing.source))) {
                return false;
            }
            return matchesQuery(listing, keywords, location);
        })
        .slice(0, Math.max(1, limit));
}

function buildMatchPayload(base: MatchListingData, listing?: JobListingPayload): MatchListingData {
    const title = listing?.title || base.job_title || "Ingenieur IA Fullstack";
    const company = listing?.company || base.job_company || "Startup AI Data";
    const location = listing?.location || "France";

    let score = base.match_score || 90;
    const loweredTitle = title.toLowerCase();
    if (loweredTitle.includes("alternance")) score = 76;
    if (loweredTitle.includes("stage")) score = 82;
    if (loweredTitle.includes("senior")) score = 93;

    return {
        ...base,
        source: listing?.source || base.source,
        title: listing?.title || base.title,
        company: listing?.company || base.company,
        location,
        url: listing?.url || base.url,
        summary: listing?.summary || base.summary,
        job_title: title,
        job_company: company,
        match_score: score,
        analysis_source: "mock",
        reasoning:
            base.reasoning ||
            "Mock analysis: the profile aligns well with the required AI, backend, and product-oriented skills.",
    };
}

export async function uploadCVPdf(file: File) {
    await delay(MOCK_DELAY);
    const mockData = await loadMockData();

    return {
        status: "success",
        data: {
            cv_cache_id: `mock-cv-${Date.now()}`,
            filename: file.name,
            cv_metadata: mockData.cv_metadata ?? DEFAULT_CV_METADATA,
        },
    };
}

export async function analyzeJob(
    cvCacheId: string,
    jobUrlText: string,
    jobFile?: File | null,
    responseLanguage: string = "en",
) {
    void cvCacheId;
    void jobUrlText;
    void jobFile;
    void responseLanguage;

    await delay(MOCK_DELAY);
    const mockData = await loadMockData();

    return {
        status: "success",
        data: {
            ...mockData.match_result,
            job_title: mockData.match_result.job_title || "Ingenieur IA Fullstack",
            job_company: mockData.match_result.job_company || "Startup AI Data",
            job_location: "France",
        } satisfies AnalyzeMatchData,
    };
}

export async function generateCoverLetter(cvCacheId: string, jobUrlText: string, jobFile?: File | null) {
    void cvCacheId;
    void jobUrlText;
    void jobFile;

    await delay(MOCK_DELAY + 250);
    const mockData = await loadMockData();

    return {
        status: "success",
        data: {
            cover_letter: mockData.cover_letter,
        },
    };
}

export async function searchJobs(
    keywords: string,
    location: string,
    postedWithin: string,
    sources: string[],
    language: string,
    limit: number = 20,
): Promise<DiscoveryResponse> {
    void postedWithin;
    void language;

    await delay(MOCK_DELAY);
    const mockData = await loadMockData();
    const results = filterListings(mockData.search_results, keywords, location, sources, limit);

    return {
        status: "success",
        data: {
            results,
            errors: {},
        },
    };
}

export async function searchByCV(
    cvCacheId: string,
    keywords: string | null = null,
    location: string | null = null,
    postedWithin: string = "all",
    sources: string[] = [],
    language: string = "en",
    limit: number = 20,
): Promise<DiscoveryResponse> {
    void cvCacheId;
    void postedWithin;
    void language;

    await delay(MOCK_DELAY);
    const mockData = await loadMockData();
    const metadata = mockData.cv_metadata ?? DEFAULT_CV_METADATA;
    const effectiveKeywords = keywords ?? metadata.suggested_keywords;
    const effectiveLocation = location ?? metadata.location ?? "";
    const results = filterListings(mockData.search_results, effectiveKeywords, effectiveLocation, sources, limit);

    return {
        status: "success",
        data: {
            results,
            errors: {},
        },
    };
}

export async function matchListing(
    cvCacheId: string,
    listing: JobListingPayload,
    responseLanguage: string = "en",
) {
    void cvCacheId;
    void responseLanguage;

    await delay(MOCK_DELAY);
    const mockData = await loadMockData();

    return {
        status: "success",
        data: buildMatchPayload(mockData.match_result, listing),
    };
}
