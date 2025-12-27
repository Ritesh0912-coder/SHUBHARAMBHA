const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const products = [
    {
        name: "श्री गौराई ॲग्रो पेरू स्पेशल कीट",
        price: "₹४५००",
        image: "/peru-kit-card.png",
        benefits: ["पेरूच्या आकारासाठी ४ टप्प्यांचे नियोजन", "निमॅटोड आणि मुळकूजवर १००% मात"],
        description: "आता पेरूवरील प्रत्येक रोगासाठी वेगळे औषध खरेदी करण्याची गरज नाही. आमचे हे कीट ४ टप्प्यात संपूर्ण बागेचे आरोग्य सुधारते.",
        usageMethod: "तज्ञांच्या सल्ल्यानुसार ड्रीप किंवा पाण्यासोबत.",
        category: "Special Kit",
        isFeatured: true
    },
    {
        name: "Nemato Super Killer (निमॅटो किलर)",
        price: "₹८९९",
        image: "/nemato.png",
        benefits: ["मुळांवरील गाठी (Nematodes) नष्ट करते", "मुळकूज आणि कोमेजणे थांबवते"],
        description: "मुळांवरील निमॅटोड (गाठी) आणि मर रोगावर अत्यंत प्रभावी जैविक सोल्यूशन. मातीतील हानिकारक सूक्ष्मजीव नष्ट करते.",
        usageMethod: "२-३ मिली प्रती लिटर पाण्यातून ड्रेचिंग (Drenching) द्वारे.",
        category: "Bio-Nematicide",
        isFeatured: false
    },
    {
        name: "K-Lifter (के-लिफ्टर)",
        price: "₹७५०",
        image: "/k-lifter.png",
        benefits: ["फळांचा आकार आणि वजन वाढवते", "फळांना उत्तम रंग आणि गोडवा देते", "जमिनीतील स्थिर पालाश उपलब्ध करून देते"],
        description: "फळांच्या उत्तम फुगवणीसाठी आणि चकाकीसाठी विशेषतः तयार केलेले पोटॅश मोबिलायझर.",
        usageMethod: "२.५ मिली प्रती लिटर पाण्यातून फवारणी किंवा ड्रीप.",
        category: "Potash Mobilizer",
        isFeatured: true
    },
    {
        name: "Bio-Magic (बायो-मॅजिक)",
        price: "₹६५०",
        image: "/bio-magic.png",
        benefits: ["फुलगळ थांबवते आणि नवीन फुले आणते", "फुलांचे फळात रूपांतर करण्याचे प्रमाण वाढवते"],
        description: "भरघोस फुलधारणेसाठी आणि कळ्या टिकवण्यासाठी नैसर्गिकरीत्या तयार केलेले बूस्टर.",
        usageMethod: "२ मिली प्रती लिटर पाण्यातून फुलधारणेच्या आधी.",
        category: "Flower Booster",
        isFeatured: false
    },
    {
        name: "Rootlix (रूटलिक्स्)",
        price: "₹५९९",
        image: "/rootlix-new.png",
        benefits: ["पांढऱ्या मुळ्यांची जोमदार वाढ", "अन्नद्रव्य शोषण्याची क्षमता वाढवते"],
        description: "पांढऱ्या मुळ्यांच्या जोमदार वाढीसाठी विशेष पावडर. पिकाला जमिनीत घट्ट पकड मिळवून देते.",
        usageMethod: "५०० ग्रॅम प्रती एकर ड्रीप किंवा पाण्यासोबत.",
        category: "Root Developer",
        isFeatured: false
    },
    {
        name: "Agni-Vayu (अग्नी-वायू)",
        price: "₹९५०",
        image: "/product-group.png",
        benefits: ["पांढरी माशी आणि तुडतुड्यांवर प्रभावी", "नैसर्गिक आणि बिनविषारी कीटकनाशक"],
        description: "पांढरी माशी आणि इतर शोषक कीटकांसाठी अत्यंत प्रभावी नैसर्गिक कीटकनाशक. पिकाला अंतर्गत ताकद देते.",
        usageMethod: "२ मिली प्रती लिटर पाण्यातून फवारणी.",
        category: "Pest Control",
        isFeatured: true
    },
    {
        name: "Sudarshan (सुदर्शन)",
        price: "₹१२००",
        image: "/product-group.png",
        benefits: ["पिकाच्या जोमदार वाढीसाठी विशेष टॉनिक", "फुलांची संख्या वाढवते"],
        description: "पिकाच्या सर्वांगीण वाढीसाठी आणि अधिक फुटव्यांसाठी विशेष टॉनिक. हिरवेपणा आणि जोम कायम राखते.",
        usageMethod: "१.५ मिली प्रती लिटर पाण्यातून फवारणी.",
        category: "Growth Promoter",
        isFeatured: false
    },
    {
        name: "Bhoomi-Shakti (भूमी-शक्ती)",
        price: "₹८५०",
        image: "/product-group.png",
        benefits: ["मातीचा पोत सुधारते", "सुपीकता आणि सेंद्रिय कर्ब वाढवते"],
        description: "मातीचा पोत सुधारण्यासाठी आणि सुपीकता वाढवण्यासाठी सेंद्रिय खत बूस्टर.",
        usageMethod: "५-१० किलो प्रती एकर जमिनीतून सेंद्रिय खतासोबत.",
        category: "Soil Conditioner",
        isFeatured: true
    },
    {
        name: "Fruit-Fine (फ्रूट-फाईन)",
        price: "₹७००",
        image: "/product-group.png",
        benefits: ["फळांना नैसर्गिक चकाकी देते", "रंग आणि वजन सुधारते"],
        description: "फळांना नैसर्गिक चकाकी, रंग आणि वजन मिळवून देण्यासाठी विशेष फवारणी.",
        usageMethod: "१ मिली प्रती लिटर पाण्यातून फळांच्या फुगवणी काळात.",
        category: "Fruit Quality Booster",
        isFeatured: false
    },
    {
        name: "Gau-Shakti (गौ-शक्ती)",
        price: "₹५५०",
        image: "/product-group.png",
        benefits: ["शेणखताचे विघटन जलद करते", "उपलब्ध नत्र वाढवते"],
        description: "शेणखताची शक्ती वाढवून पिकांना उपलब्ध करून देणारे जैविक घटक.",
        usageMethod: "१ लिटर प्रती एकर शेणखतासोबत किंवा पाण्यातून.",
        category: "Manure Booster",
        isFeatured: false
    },
    {
        name: "Pseudo (Radix)",
        price: "₹८००",
        image: "/pseudo.png",
        benefits: ["Control Bacterial Disease", "Boosts Plant Immunity"],
        description: "Effective control for bacterial disease in crops. Helps in reducing bacterial wilt and leaf spots.",
        usageMethod: "Foliar spray or soil application as per requirement.",
        category: "Bactericide",
        isFeatured: false
    },
    {
        name: "Tricho (Radix)",
        price: "₹८००",
        image: "/tricho.png",
        benefits: ["Control for harmful Fungi", "Protects Roots"],
        description: "Bio-fungicide that controls soil-borne pathogens and improves root health.",
        usageMethod: "Soil drenching or seed treatment.",
        category: "Fungicide",
        isFeatured: false
    },
    {
        name: "Anar Special Kit",
        price: "₹१५००",
        image: "/anar-special.png",
        benefits: ["Complete Nutrition for Pomegranate", "Improves Fruit Size & Color"],
        description: "Specialized kit for pomegranate (Anar) crops to ensure high yield and quality fruit.",
        usageMethod: "Use as per schedule provided in the box.",
        category: "Special Kit",
        isFeatured: true
    },
    {
        name: "CIBA (Radix)",
        price: "₹९००",
        image: "/ciba.png",
        benefits: ["Special for flower initiation", "Reduces Flower Drop"],
        description: "Promotes profuse flowering and reduces flower dropping in various crops.",
        usageMethod: "Spray during flowering stage.",
        category: "Flower Booster",
        isFeatured: true
    },
    {
        name: "Croptonic (Radix)",
        price: "₹१०००",
        image: "/croptonic.png",
        benefits: ["Advance Bio Stimulant", "Increases Yield"],
        description: "Advanced bio-stimulant for overall crop growth, stress resistance, and yield improvement.",
        usageMethod: "Foliar spray during active growth period.",
        category: "Bio Stimulant",
        isFeatured: false
    },
    {
        name: "Shubharambha Peru Special Kit",
        price: "₹१२००",
        image: "/shubharambha-kit.png",
        benefits: ["Complete Nutrition for Guava", "Improves Size & Sweetness"],
        description: "All-in-one kit for Guava (Peru) cultivation. Ensures balanced nutrition and protection.",
        usageMethod: "Use as per kit instructions.",
        category: "Special Kit",
        isFeatured: true
    },
    {
        name: "Subtilis (Radix)",
        price: "₹८००",
        image: "/subtilis.png",
        benefits: ["Controls Bacterial Wilt", "Soil Health Improvement"],
        description: "Bacillus Subtilis based bio-bactericide. Effective against soil-borne bacterial pathogens.",
        usageMethod: "Drenching or soil application.",
        category: "Bactericide",
        isFeatured: false
    },
    {
        name: "Bio-Magic (Radix Premium)",
        price: "₹९५०",
        image: "/bio-magic-radix.png",
        benefits: ["Enhanced Flowering", "Reduces Flower Drop"],
        description: "Premium flowering stimulant. Ensures maximum conversion of flowers to fruit.",
        usageMethod: "Foliar spray during pre-flowering.",
        category: "Flower Booster",
        isFeatured: true
    },
    {
        name: "Evitor (Radix)",
        price: "₹८५०",
        image: "/evitor.png",
        benefits: ["Controls Larvae & Sucking Pests", "Eco-friendly"],
        description: "Effective bio-pesticide for controlling larvae and sucking pests without chemical residue.",
        usageMethod: "Spray 2ml per liter of water.",
        category: "Pest Control",
        isFeatured: false
    },
    {
        name: "P-Lifter & K-Lifter Combo",
        price: "₹१२००",
        image: "/lifter-combo.png",
        benefits: ["Mobilizes Phosphorous & Potash", "Improves Fruit Quality"],
        description: "Combo pack of Phosphate Solubilizing Bacteria (PSB) and Potash Mobilizer. Essential for fruit development.",
        usageMethod: "Drip irrigation or drenching.",
        category: "Soil Health",
        isFeatured: true
    },
    {
        name: "Nutrimax (Radix)",
        price: "₹७५०",
        image: "/nutrimax.png",
        benefits: ["Complete Micronutrient Mix", "Enriched with Amino & Seaweed"],
        description: "Liquid micronutrient formula (Grade II) for resolving nutrient deficiencies.",
        usageMethod: "Foliar spray.",
        category: "Micronutrients",
        isFeatured: false
    },
    {
        name: "Spark (Radix)",
        price: "₹५५०",
        image: "/spark.png",
        benefits: ["Neem/Karanj Oil Combo", "Effective Pest Repellent"],
        description: "Herbal combination for pest control. 10000 ppm formulation.",
        usageMethod: "Spray as preventative measure.",
        category: "Pest Control",
        isFeatured: false
    },
    {
        name: "Zycoprime (Radix)",
        price: "₹१४००",
        image: "/zycoprime.png",
        benefits: ["All-in-one Growth Booster", "High Solubility"],
        description: "Comprehensive plant food for vegetative growth and root development.",
        usageMethod: "Drip or drenching.",
        category: "Growth Promoter",
        isFeatured: true
    },
    {
        name: "Bio-Strock (Radix)",
        price: "₹६५०",
        image: "/bio-strock.png",
        benefits: ["Multipurpose Plant Food", "Improves Greenery"],
        description: "Organic plant food supplement for overall health and vigor.",
        usageMethod: "Foliar spray or soil application.",
        category: "Plant Food",
        isFeatured: false
    }
];

async function main() {
    console.log("Starting seed process...");

    // Clear existing products
    console.log("Clearing existing products...");
    await prisma.product.deleteMany({});

    // Insert new products
    console.log(`Seeding ${products.length} products...`);
    for (const product of products) {
        await prisma.product.create({
            data: product
        });
        console.log(`Created: ${product.name}`);
    }

    console.log("Seeding completed successfully.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
