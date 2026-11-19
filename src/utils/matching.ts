import {
  BuyerRequirement,
  MatchLabel,
  MatchResult,
  MaterialCategory,
  MaterialListing,
  QuantityUnit,
} from '../types/marketplace';

const PUNE_INDUSTRIAL_BELT = [
  'pune',
  'chakan',
  'pimpri',
  'pimpri-chinchwad',
  'pcmc',
  'talegaon',
  'bhosari',
  'ranjangaon',
  'hinjewadi',
  'hadapsar',
];

const METAL_FAMILY: MaterialCategory[] = ['Metal Scrap', 'Steel', 'Aluminium', 'Copper'];
const PACKAGING_FAMILY: MaterialCategory[] = ['Paper and Cardboard', 'Packaging Waste'];

const STOP_WORDS = new Set([
  'for',
  'and',
  'the',
  'with',
  'from',
  'into',
  'clean',
  'usable',
  'industrial',
  'scrap',
  'material',
  'materials',
  'grade',
  'waste',
  'raw',
  'need',
  'needed',
  'required',
]);

export function normalizeToKg(quantity: number, unit: QuantityUnit): number {
  return unit === 'TON' ? quantity * 1000 : quantity;
}

export function formatCurrencyINR(amount?: number): string {
  if (amount === undefined || amount === null || Number.isNaN(amount)) {
    return 'Price on Quotation';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));
}

function isSameIndustrialBelt(locA: string, locB: string): boolean {
  const a = locA.trim().toLowerCase();
  const b = locB.trim().toLowerCase();
  const aInPune = PUNE_INDUSTRIAL_BELT.some((city) => a.includes(city));
  const bInPune = PUNE_INDUSTRIAL_BELT.some((city) => b.includes(city));
  return aInPune && bInPune;
}

export function matchRequirementToListings(
  requirement: BuyerRequirement,
  listings: MaterialListing[]
): MatchResult[] {
  const activeListings = listings.filter((l) => l.status === 'Active');

  const reqKeywords = tokenize(
    `${requirement.requiredMaterial} ${requirement.materialType ?? ''}`
  );
  const reqGradeTokens = tokenize(requirement.preferredGrade);
  const reqQtyKg = normalizeToKg(requirement.requiredQuantity, requirement.unit);
  const reqLoc = requirement.preferredLocation.trim().toLowerCase();

  const results: MatchResult[] = [];

  for (const listing of activeListings) {
    let score = 0;
    const reasons: string[] = [];
    const verificationNotes: string[] = [];

    // 1. Category comparison (max 30 pts)
    let categoryMatched = false;
    if (listing.category === requirement.category) {
      score += 30;
      categoryMatched = true;
      reasons.push(`Exact category alignment (${listing.category})`);
    } else if (
      (METAL_FAMILY.includes(listing.category) && METAL_FAMILY.includes(requirement.category)) ||
      (PACKAGING_FAMILY.includes(listing.category) &&
        PACKAGING_FAMILY.includes(requirement.category))
    ) {
      // Only award partial family credit if at least one broad metal/packaging category is requested
      if (
        requirement.category === 'Metal Scrap' ||
        listing.category === 'Metal Scrap' ||
        PACKAGING_FAMILY.includes(requirement.category)
      ) {
        score += 18;
        categoryMatched = true;
        reasons.push(`Related material stream (${listing.category} / ${requirement.category})`);
        verificationNotes.push(
          `Confirm alloy or fiber composition matches ${requirement.category} specifications.`
        );
      }
    }

    // 2. Material Name & Type keyword overlap (max 25 pts)
    const listingText = `${listing.name} ${listing.type} ${listing.description}`.toLowerCase();
    const matchedKeywords = reqKeywords.filter((kw) => listingText.includes(kw));
    const typeOrKeywordMatched = matchedKeywords.length > 0;
    if (matchedKeywords.length >= 2) {
      score += 25;
      reasons.push(
        `Material type & keywords matched (${matchedKeywords.slice(0, 3).join(', ')})`
      );
    } else if (matchedKeywords.length === 1) {
      score += 15;
      reasons.push(`Material keyword matched ("${matchedKeywords[0]}")`);
    } else {
      verificationNotes.push('Verify physical form factor and material type with supplier.');
    }

    // 3. Grade / Quality matching (max 20 pts)
    const listingGradeText = `${listing.grade} ${listing.name} ${listing.description}`.toLowerCase();
    const matchedGradeTokens = reqGradeTokens.filter((token) => listingGradeText.includes(token));
    const gradeMatched = matchedGradeTokens.length > 0;
    if (matchedGradeTokens.length >= 2) {
      score += 20;
      reasons.push(`Supplier-stated grade aligns with "${requirement.preferredGrade}"`);
    } else if (matchedGradeTokens.length === 1) {
      score += 12;
      reasons.push(`Partial grade overlap (${matchedGradeTokens[0]})`);
      verificationNotes.push(
        `Inspect full chemical/physical grade (${listing.grade}) before procurement.`
      );
    } else {
      verificationNotes.push(
        `Supplier states "${listing.grade}"; independent verification required against "${requirement.preferredGrade}".`
      );
    }

    // 4. Quantity sufficiency (max 15 pts, unit-normalized)
    const listQtyKg = normalizeToKg(listing.quantity, listing.unit);
    let quantityStatus: 'sufficient' | 'partial' | 'insufficient' = 'insufficient';
    if (listQtyKg >= reqQtyKg) {
      score += 15;
      quantityStatus = 'sufficient';
      reasons.push(
        `Available supply (${listing.quantity} ${listing.unit}) covers required ${requirement.requiredQuantity} ${requirement.unit}`
      );
    } else if (listQtyKg >= reqQtyKg * 0.5) {
      score += 8;
      quantityStatus = 'partial';
      reasons.push(
        `Partial volume available (${listing.quantity} ${listing.unit} of ${requirement.requiredQuantity} ${requirement.unit} required)`
      );
      verificationNotes.push('May require combining lots or staggered dispatch to meet volume.');
    } else {
      verificationNotes.push(
        `Listed volume (${listing.quantity} ${listing.unit}) is below your target of ${requirement.requiredQuantity} ${requirement.unit}.`
      );
    }

    // 5. Location match (max 10 pts)
    const listLoc = listing.location.trim().toLowerCase();
    let locationStatus: 'exact' | 'regional' | 'other' = 'other';
    if (reqLoc && listLoc === reqLoc) {
      score += 10;
      locationStatus = 'exact';
      reasons.push(`Exact city match (${listing.location})`);
    } else if (reqLoc && (listLoc.includes(reqLoc) || reqLoc.includes(listLoc))) {
      score += 10;
      locationStatus = 'exact';
      reasons.push(`Direct location match (${listing.location})`);
    } else if (reqLoc && isSameIndustrialBelt(listLoc, reqLoc)) {
      score += 7;
      locationStatus = 'regional';
      reasons.push(`Nearby Pune industrial corridor (${listing.location} ↔ ${requirement.preferredLocation})`);
    } else {
      verificationNotes.push(
        `Material is located in ${listing.location}; evaluate freight distance to ${requirement.preferredLocation}.`
      );
    }

    // Budget note (non-blocking informational cue)
    if (requirement.budget && listing.expectedPrice) {
      const normalizedReqUnitPrice =
        requirement.unit === listing.unit
          ? requirement.budget
          : requirement.unit === 'TON' && listing.unit === 'KG'
            ? requirement.budget / 1000
            : requirement.budget * 1000;

      if (listing.expectedPrice <= normalizedReqUnitPrice) {
        reasons.push(`Expected price is within your indicative budget`);
      } else {
        verificationNotes.push(
          `Expected price (${formatCurrencyINR(listing.expectedPrice)}/${listing.unit}) exceeds indicative budget; negotiate via quotation.`
        );
      }
    }

    // Gate: must have either category relevance or material keyword relevance to qualify as a match
    if (!categoryMatched && !typeOrKeywordMatched) {
      continue;
    }

    let label: MatchLabel;
    if (score >= 70 && categoryMatched) {
      label = 'Strong Potential Match';
    } else if (score >= 45) {
      label = 'Partial Match';
    } else {
      label = 'Additional Verification Required';
    }

    // Always append disclaimer note regarding unverified specs
    if (verificationNotes.length === 0) {
      verificationNotes.push(
        'Specifications are supplier-provided and should be independently checked prior to transaction.'
      );
    }

    results.push({
      listing,
      label,
      score,
      reasons,
      verificationNotes,
      criteriaBreakdown: {
        category: categoryMatched,
        typeOrKeyword: typeOrKeywordMatched,
        grade: gradeMatched,
        quantity: quantityStatus,
        location: locationStatus,
      },
    });
  }

  return results.sort((a, b) => b.score - a.score);
}
