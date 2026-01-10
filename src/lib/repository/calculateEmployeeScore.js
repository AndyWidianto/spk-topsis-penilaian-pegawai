import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./token.service";
import { AppError } from "../errors/AppError";

const prisma = new PrismaClient();
export async function CalculateTopsisOtomatis(month, year) {
    const criterias = (await prisma.criterias.findMany()).map((c) => {
        c.weight = c.weight / 100;
        return { ...c };
    });
    const priode = await prisma.priodes.findFirst({
        where: {
            month,
            year
        },
        include: {
            assessments: {
                include: {
                    employees: true,
                    assessment_details: true
                }
            }
        }
    });
    if (!priode) {
        throw new AppError("Priode tidak tersedia", 404);
    }
    if (priode.assessments.length < 1) {
        return { priode, criterias };
    }
    const alternatives = priode.assessments.map(ats => {
        return {
            id: ats.id,
            name: ats.employees.name,
            detail: ats.assessment_details,
        };
    });

    let totalNilaiCriterias = [];
    criterias.forEach((item) => {
        let sumKuadrat = {};
        alternatives.forEach(alt => {
            alt.detail.forEach(detail => {
                if (item.id === detail.criteria_id) {
                    sumKuadrat[item.id] = (sumKuadrat[item.id] || 0) + detail.nilai ** 2;
                }
            })
        });
        totalNilaiCriterias.push({ ...item, total: Math.sqrt(sumKuadrat[item.id]) });
    })

    let normalisasiMatriks = [];
    let bestValue = {};
    let worstValue = {};
    alternatives.forEach(alt => {
        let total;
        let details = [];
        alt.detail.forEach(detail => {
            const criteria = totalNilaiCriterias.find(c => c.id === detail.criteria_id);
            if (criteria) {
                total = (detail.nilai / criteria.total) * criteria.weight;
                if (criteria.type === "benefit") {
                    bestValue[criteria.id] = Math.max(bestValue[criteria.id] ?? total, total);
                    worstValue[criteria.id] = Math.min(worstValue[criteria.id] ?? total, total);
                } else {
                    bestValue[criteria.id] = Math.min(bestValue[criteria.id] ?? total, total);
                    worstValue[criteria.id] = Math.max(worstValue[criteria.id] ?? total, total);
                }
                details.push({ ...detail, total: total });
            }
        });
        normalisasiMatriks.push({ id: alt.id, name: alt.name, details: details });
    });

    const distances = [];
    normalisasiMatriks.forEach(nms => {
        let distancePlus = 0;
        let distanceMin = 0;
        nms.details.forEach(detail => {
            distancePlus += (detail.total - bestValue[detail.criteria_id]) ** 2;
            distanceMin += (detail.total - worstValue[detail.criteria_id]) ** 2;
        });
        distances.push({ id: nms.id, name: nms.name, distance_plus: distancePlus, distance_min: distanceMin });
    })

    let preferences = [];
    distances.forEach(dtc => {
        const nilaiV = dtc.distance_min / (dtc.distance_plus + dtc.distance_min);
        preferences.push({ ...dtc, nilai_v: nilaiV });
    })

    preferences = preferences.sort((a, b) => b.nilai_v - a.nilai_v).forEach((item, index) => {
        item.ranking = index + 1;
    });

    await prisma.$transaction(
        preferences.map((item) => prisma.assessments.update({
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
    const findPriode = await prisma.priodes.findFirst({
        where: {
            month: month,
            year: year
        }
    });
    if (!findPriode) {
        await prisma.priodes.create({
            data: { month, year, status: "active" }
        });
    }
    await prisma.notifications.create({
        data: {
            user_id: null,
            target_role: "all",
            message: "Perhitungan SPK berhasil dijalankan secara otomatis",
            is_read: false,
            type: "success",
            action_url: "/dashboard/topsis-calculate",
        }
    })
    return { priode, criterias };
}

export async function CalculateTopsisManual(token, ip, id) {
    const user = verifyAccessToken(token);
    if (user.role !== "super_admin" && user.role !== "admin") {
        throw new AppError("Anda tidak dizinkan untuk melakukan proses perhitungan!", 403);
    }
    const date = new Date();
    let query = { id };
    if (!id) {
        query = {
            month: date.getMonth() + 1,
            year: date.getFullYear()
        }
    }
    const criterias = (await prisma.criterias.findMany()).map((c) => {
        c.weight = c.weight / 100;
        return { ...c };
    });
    const priode = await prisma.priodes.findFirst({
        where: query,
        include: {
            assessments: {
                include: {
                    employees: true,
                    assessment_details: true
                }
            }
        }
    });
    if (!priode) {
        throw new AppError("Priode tidak tersedia", 404);
    }
    if (priode.assessments.length < 1) {
        return { priode, criterias };
    }
    const alternatives = priode.assessments.map(ats => {
        return {
            id: ats.id,
            name: ats.employees.name,
            detail: ats.assessment_details,
        };
    });

    let totalNilaiCriterias = [];
    criterias.forEach((item) => {
        let sumKuadrat = {};
        alternatives.forEach(alt => {
            alt.detail.forEach(detail => {
                if (item.id === detail.criteria_id) {
                    sumKuadrat[item.id] = (sumKuadrat[item.id] || 0) + detail.nilai ** 2;
                }
            })
        });
        totalNilaiCriterias.push({ ...item, total: Math.sqrt(sumKuadrat[item.id]) });
    })

    let normalisasiMatriks = [];
    let bestValue = {};
    let worstValue = {};
    alternatives.forEach(alt => {
        let total;
        let totalR;
        let details = [];
        alt.detail.forEach(detail => {
            const criteria = totalNilaiCriterias.find(c => c.id === detail.criteria_id);
            if (criteria) {
                totalR = (detail.nilai / criteria.total);
                total = (detail.nilai / criteria.total) * criteria.weight;
                if (criteria.type === "benefit") {
                    bestValue[criteria.id] = Math.max(bestValue[criteria.id] ?? total, total);
                    worstValue[criteria.id] = Math.min(worstValue[criteria.id] ?? total, total);
                } else {
                    bestValue[criteria.id] = Math.min(bestValue[criteria.id] ?? total, total);
                    worstValue[criteria.id] = Math.max(worstValue[criteria.id] ?? total, total);
                }
                details.push({ ...detail, total_r: totalR, total: total });
            }
        });
        normalisasiMatriks.push({ id: alt.id, name: alt.name, details: details });
    });

    const distances = [];
    normalisasiMatriks.forEach(nms => {
        let distancePlus = 0;
        let distanceMin = 0;
        nms.details.forEach(detail => {
            distancePlus += (detail.total - bestValue[detail.criteria_id]) ** 2;
            distanceMin += (detail.total - worstValue[detail.criteria_id]) ** 2;
        });
        distances.push({ id: nms.id, name: nms.name, distance_plus: distancePlus, distance_min: distanceMin });
    })

    let preferences = [];
    distances.forEach(dtc => {
        const nilaiV = dtc.distance_min / (dtc.distance_plus + dtc.distance_min);
        preferences.push({ ...dtc, nilai_v: nilaiV });
    })

    preferences.sort((a, b) => b.nilai_v - a.nilai_v).forEach((item, index) => {
        item.ranking = index + 1;
    });

    await prisma.$transaction(
        preferences.map((item) => prisma.assessments.update({
            where: {
                id: item.id
            },
            data: {
                ranking: item.ranking,
                total_value: item.nilai_v
            }
        }))
    )
    await prisma.priodes.update({
        where: {
            id: priode.id
        },
        data: {
            status: "finished"
        }
    });
    let month = priode.month + 1;
    let year = priode.year;
    if (month > 12) {
        month = 1;
        year += 1;
    }
    const findPriode = await prisma.priodes.findFirst({
        where: {
            month: month,
            year: year
        }
    });
    if (!findPriode) {
        await prisma.priodes.create({
            data: { month, year, status: "active" }
        });
    }
    await prisma.auditLogs.create({
        data: {
            user_id: user.id,
            user_role: user.role,
            action: "CALCULATE",
            entity: "topsis calculate",
            entity_id: priode.id,
            ip_address: ip
        }
    })
    await prisma.notifications.create({
        data: {
            user_id: user.id,
            message: "Berhasil melakukan perhitungan SPK",
            read: false,
            type: "success",
            action_url: `/dashboard/topsis-calculate`,
        }
    })
    return { criterias, priode };
}