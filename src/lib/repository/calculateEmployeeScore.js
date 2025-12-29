import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function CountingProses(month, year) {
    const data = await prisma.priodes.findFirst({
        where: {
            month,
            year
        },
        include: {
            assessments: {
                include: {
                    employees: true,
                    assessemnt_details: {
                        include: {
                            criterias: true
                        }
                    },
                },
            },
        }
    })

    // state 
    let kriteria = [];
    let normalisasi_metrik = [];
    let nilai_preferensi = [];
    let sumKuadrat = {};
    let akar = {};
    let nilai_terbaik = {};
    let nilai_terburuk = {};

    for (const assessment of data.assessments) {
        if (assessment.assessemnt_details.length > 0) {
            let nilai = {};
            assessment.assessemnt_details.forEach((detail) => {
                nilai[detail.criterias.code] = { score: detail.nilai, type: detail.criterias.type, weight: detail.criterias.weight };
            })
            kriteria.push({
                assessment_id: assessment.id,
                name: assessment.employees.name,
                ...nilai
            })
        }
    }
    // 1️⃣ Jumlah kuadrat
    kriteria.forEach(item => {
        Object.entries(item).forEach(([key, val]) => {
            if (key !== "name" && key !== "assessment_id") {
                sumKuadrat[key] = (sumKuadrat[key] || 0) + val.score ** 2;
            }
        });
    });

    // 2️⃣ Akar
    Object.entries(sumKuadrat).forEach(([key, val]) => {
        akar[key] = Math.sqrt(val);
    });

    // 3️⃣ Normalisasi terbobot + A+ A-
    kriteria.forEach(item => {
        let row = {
            assessment_id: item.assessment_id,
            name: item.name
        };

        Object.entries(item).forEach(([key, val]) => {
            if (key !== "name" && key !== "assessment_id") {
                const score = (val.score / akar[key]) * (val.weight / 100);
                row[key] = score;

                if (val.type === "benefit") {
                    nilai_terbaik[key] = Math.max(nilai_terbaik[key] ?? score, score);
                    nilai_terburuk[key] = Math.min(nilai_terburuk[key] ?? score, score);
                } else {
                    nilai_terbaik[key] = Math.min(nilai_terbaik[key] ?? score, score);
                    nilai_terburuk[key] = Math.max(nilai_terburuk[key] ?? score, score);
                }
            }
        });

        normalisasi_metrik.push(row);
    });

    // 4️⃣ Jarak & nilai preferensi
    normalisasi_metrik.forEach(item => {
        let dPlus = 0;
        let dMinus = 0;

        Object.keys(nilai_terbaik).forEach(key => {
            dPlus += (item[key] - nilai_terbaik[key]) ** 2;
            dMinus += (item[key] - nilai_terburuk[key]) ** 2;
        });

        const score = Math.sqrt(dMinus) / (Math.sqrt(dMinus) + Math.sqrt(dPlus));
        nilai_preferensi.push({ ...item, score });
    });

    nilai_preferensi.sort((a, b) => b.score - a.score).forEach((item, index) => {
        item.ranking = index + 1;
    });

    const assessments = await prisma.$transaction(
        nilai_preferensi.map((item) => prisma.assessments.update({
            where: {
                id: item.assessment_id
            },
            data: {
                ranking: item.ranking,
                total_value: item.score
            }
        }))
    )
    await prisma.priodes.update({
        where: {
            id: data.id
        },
        data: {
            status: "finished"
        }
    });
    if (month > 12) {
        month = 1;
        year = year + 1;
    }
    await prisma.priodes.create({
        data: { month, year }
    });
    return { normalisasi_metrik, nilai_preferensi, assessments };
}