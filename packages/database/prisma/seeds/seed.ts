import { PrismaClient, typeCoworking, PlansRate } from '@prisma/client'; // ✅ Importa gli enum
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');
    
    // Pulisci il database
    await prisma.booking.deleteMany();
    await prisma.packagePlan.deleteMany();
    await prisma.package.deleteMany();
    await prisma.closingPeriod.deleteMany();
    await prisma.openDays.deleteMany();
    await prisma.paymentInfo.deleteMany();
    await prisma.venue.deleteMany();
    await prisma.user.deleteMany();
    
    // 1. Crea password hashata (personalizzabile qui)
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    
    // 2. Crea 15 utenti HOST (uno per venue)
    const hosts = [];
    const hostNames = [
        { first: 'Marco', last: 'Rossi', email: 'marco.rossi@example.com' },
        { first: 'Laura', last: 'Bianchi', email: 'laura.bianchi@example.com' },
        { first: 'Giuseppe', last: 'Verdi', email: 'giuseppe.verdi@example.com' },
        { first: 'Maria', last: 'Ferrari', email: 'maria.ferrari@example.com' },
        { first: 'Alessandro', last: 'Romano', email: 'alessandro.romano@example.com' },
        { first: 'Francesca', last: 'Colombo', email: 'francesca.colombo@example.com' },
        { first: 'Roberto', last: 'Ricci', email: 'roberto.ricci@example.com' },
        { first: 'Elena', last: 'Marino', email: 'elena.marino@example.com' },
        { first: 'Luca', last: 'Greco', email: 'luca.greco@example.com' },
        { first: 'Chiara', last: 'Bruno', email: 'chiara.bruno@example.com' },
        { first: 'Andrea', last: 'Gallo', email: 'andrea.gallo@example.com' },
        { first: 'Valentina', last: 'Conti', email: 'valentina.conti@example.com' },
        { first: 'Matteo', last: 'De Luca', email: 'matteo.deluca@example.com' },
        { first: 'Sara', last: 'Mancini', email: 'sara.mancini@example.com' },
        { first: 'Paolo', last: 'Costa', email: 'paolo.costa@example.com' },
    ];
    
    for (const hostData of hostNames) {
        const host = await prisma.user.create({
            data: {
                email: hostData.email,
                password: hashedPassword,
                firstName: hostData.first,
                lastName: hostData.last,
                role: 'HOST',
            },
        });
        hosts.push(host);
    }
    
    // 3. Crea 3 utenti USER (clienti)
    const user1 = await prisma.user.create({
        data: {
            email: 'anna.ferrari@example.com',
            password: hashedPassword,
            firstName: 'Anna',
            lastName: 'Ferrari',
            role: 'USER',
        },
    });
    
    const user2 = await prisma.user.create({
        data: {
            email: 'giovanni.russo@example.com',
            password: hashedPassword,
            firstName: 'Giovanni',
            lastName: 'Russo',
            role: 'USER',
        },
    });
    
    const user3 = await prisma.user.create({
        data: {
            email: 'sofia.esposito@example.com',
            password: hashedPassword,
            firstName: 'Sofia',
            lastName: 'Esposito',
            role: 'USER',
        },
    });
    
    console.log('✅ Created 18 users (15 HOSTs, 3 USERs)');
    
    // 4. Definizione dei 15 venues
    const venuesData = [
        {
            name: 'Tech Hub Milano Centro',
            address: 'Via Dante 15, 20121 Milano MI',
            description: 'Spazio moderno nel cuore di Milano con postazioni flessibili',
            services: ['WiFi Alta Velocità', 'Stampante', 'Caffè Gratuito', 'Sale Riunioni'],
            photos: ['https://placehold.co/800x600/667eea/ffffff?text=Tech+Hub+Milano'],
            logoURL: 'https://placehold.co/200x200/667eea/ffffff?text=TH',
            latitude: 45.464664,
            longitude: 9.188540,
            hasPackages: true,
        },
        {
            name: 'Creative Loft Roma',
            address: 'Via del Corso 120, 00186 Roma RM',
            description: 'Loft luminoso ideale per creativi e startup',
            services: ['WiFi', 'Cucina', 'Terrazza', 'Proiettore'],
            photos: ['https://placehold.co/800x600/ff6b6b/ffffff?text=Creative+Loft'],
            logoURL: 'https://placehold.co/200x200/ff6b6b/ffffff?text=CL',
            latitude: 41.900276,
            longitude: 12.482628,
            hasPackages: true,
        },
        {
            name: 'Innovation Space Torino',
            address: 'Corso Francia 23, 10143 Torino TO',
            description: 'Spazio innovativo con tecnologie all\'avanguardia',
            services: ['WiFi 1Gbps', 'Stampante 3D', 'VR Room', 'Podcast Studio'],
            photos: ['https://placehold.co/800x600/4ecdc4/ffffff?text=Innovation+Space'],
            logoURL: 'https://placehold.co/200x200/4ecdc4/ffffff?text=IS',
            latitude: 45.070312,
            longitude: 7.686864,
            hasPackages: true,
        },
        {
            name: 'Coworking Firenze Centro',
            address: 'Piazza della Repubblica 1, 50123 Firenze FI',
            description: 'Elegante spazio nel centro storico di Firenze',
            services: ['WiFi', 'Caffetteria', 'Locker', 'Sala Relax'],
           
            logoURL: 'https://placehold.co/200x200/f39c12/ffffff?text=FC',
            latitude: 43.771389,
            longitude: 11.253611,
            hasPackages: true,
        },
        {
            name: 'Digital Hub Napoli',
            address: 'Via Toledo 256, 80134 Napoli NA',
            description: 'Hub digitale con vista sul golfo',
            services: ['WiFi', 'Stampante', 'Parcheggio', 'Cucina'],
            photos: ['https://placehold.co/800x600/e74c3c/ffffff?text=Digital+Hub'],
            logoURL: 'https://placehold.co/200x200/e74c3c/ffffff?text=DH',
            latitude: 40.838333,
            longitude: 14.248889,
            hasPackages: true,
        },
        {
            name: 'Smart Office Bologna',
            address: 'Via Rizzoli 3, 40125 Bologna BO',
            description: 'Uffici intelligenti nel cuore universitario',
            services: ['WiFi', 'Sale Meeting', 'Bike Parking', 'Caffè'],
            photos: ['https://placehold.co/800x600/9b59b6/ffffff?text=Smart+Office'],
            logoURL: 'https://placehold.co/200x200/9b59b6/ffffff?text=SO',
            latitude: 44.494887,
            longitude: 11.342616,
            hasPackages: true,
        },
        {
            name: 'Business Center Genova',
            address: 'Via XX Settembre 41, 16121 Genova GE',
            description: 'Centro business con vista porto',
            services: ['WiFi', 'Reception', 'Sala Conferenze', 'Catering'],
            photos: ['https://placehold.co/800x600/16a085/ffffff?text=Business+Center'],
            logoURL: 'https://placehold.co/200x200/16a085/ffffff?text=BC',
            latitude: 44.407062,
            longitude: 8.933939,
            hasPackages: true,
        },
        {
            name: 'Work Loft Verona',
            address: 'Corso Porta Nuova 96, 37122 Verona VR',
            description: 'Loft di lavoro in stile industriale',
            services: ['WiFi', 'Stampante', 'Relax Area', 'Bike Station'],
            photos: ['https://placehold.co/800x600/d35400/ffffff?text=Work+Loft'],
            logoURL: 'https://placehold.co/200x200/d35400/ffffff?text=WL',
            latitude: 45.438384,
            longitude: 10.992522,
            hasPackages: true,
        },
        {
            name: 'Innovation Lab Padova',
            address: 'Via VIII Febbraio 2, 35122 Padova PD',
            description: 'Laboratorio per innovatori e maker',
            services: ['WiFi', 'FabLab', 'Stampante 3D', 'Workshop Room'],
            photos: ['https://placehold.co/800x600/27ae60/ffffff?text=Innovation+Lab'],
            logoURL: 'https://placehold.co/200x200/27ae60/ffffff?text=IL',
            latitude: 45.406435,
            longitude: 11.876761,
            hasPackages: true,
        },
        {
            name: 'Creative Space Palermo',
            address: 'Via Maqueda 172, 90133 Palermo PA',
            description: 'Spazio creativo nel cuore barocco',
            services: ['WiFi', 'Studio Fotografico', 'Sala Posa', 'Caffè'],
            photos: ['https://placehold.co/800x600/2980b9/ffffff?text=Creative+Space'],
            logoURL: 'https://placehold.co/200x200/2980b9/ffffff?text=CS',
            latitude: 38.115689,
            longitude: 13.361267,
            hasPackages: true,
        },
        // I prossimi 5 SENZA packages
        {
            name: 'StartUp Hub Bari',
            address: 'Corso Cavour 12, 70122 Bari BA',
            description: 'Hub per startup in fase di allestimento',
            services: ['WiFi', 'Reception'],
            photos: ['https://placehold.co/800x600/95a5a6/ffffff?text=StartUp+Hub'],
            logoURL: 'https://placehold.co/200x200/95a5a6/ffffff?text=SH',
            latitude: 41.117143,
            longitude: 16.871872,
            hasPackages: false,
        },
        {
            name: 'Tech Center Trieste',
            address: 'Piazza Unità d\'Italia 1, 34121 Trieste TS',
            description: 'Centro tecnologico in preparazione',
            services: ['WiFi'],
            photos: ['https://placehold.co/800x600/7f8c8d/ffffff?text=Tech+Center'],
            logoURL: 'https://placehold.co/200x200/7f8c8d/ffffff?text=TC',
            latitude: 45.649526,
            longitude: 13.776818,
            hasPackages: false,
        },
        {
            name: 'Work Station Brescia',
            address: 'Via Musei 32, 25121 Brescia BS',
            description: 'Stazione di lavoro in ristrutturazione',
            services: ['WiFi', 'Parcheggio'],
            photos: ['https://placehold.co/800x600/34495e/ffffff?text=Work+Station'],
            logoURL: 'https://placehold.co/200x200/34495e/ffffff?text=WS',
            latitude: 45.541553,
            longitude: 10.211885,
            hasPackages: false,
        },
        {
            name: 'Business Hub Cagliari',
            address: 'Via Roma 145, 09124 Cagliari CA',
            description: 'Hub business di prossima apertura',
            services: ['WiFi', 'Caffetteria'],
            photos: ['https://placehold.co/800x600/5d6d7e/ffffff?text=Business+Hub'],
            logoURL: 'https://placehold.co/200x200/5d6d7e/ffffff?text=BH',
            latitude: 39.223841,
            longitude: 9.121661,
            hasPackages: false,
        },
        {
            name: 'Digital Space Catania',
            address: 'Via Etnea 88, 95131 Catania CT',
            description: 'Spazio digitale in fase di setup',
            services: ['WiFi'],
            photos: ['https://placehold.co/800x600/566573/ffffff?text=Digital+Space'],
            logoURL: 'https://placehold.co/200x200/566573/ffffff?text=DS',
            latitude: 37.502669,
            longitude: 15.087269,
            hasPackages: false,
        },
    ];
    
    // 5. Crea i 15 venues
    const venues = [];
    for (let i = 0; i < venuesData.length; i++) {
        const venueData = venuesData[i];
        const venue = await prisma.venue.create({
            data: {
                name: venueData.name,
                address: venueData.address,
                description: venueData.description,
                services: venueData.services,
                photos: venueData.photos,
                logoURL: venueData.logoURL,
                latitude: venueData.latitude,
                longitude: venueData.longitude,
                reviewsCounter: Math.random() * 2 + 3.5, // Random tra 3.5 e 5.5
                venueRatings: Math.floor(Math.random() * 100) + 20, // Random tra 20 e 120
                openingDays: {
                    create: [
                        { day: 'MONDAY', isClosed: false, periods: ['09:00-13:00', '14:00-18:00'] },
                        { day: 'TUESDAY', isClosed: false, periods: ['09:00-13:00', '14:00-18:00'] },
                        { day: 'WEDNESDAY', isClosed: false, periods: ['09:00-13:00', '14:00-18:00'] },
                        { day: 'THURSDAY', isClosed: false, periods: ['09:00-13:00', '14:00-18:00'] },
                        { day: 'FRIDAY', isClosed: false, periods: ['09:00-13:00', '14:00-17:00'] },
                        { day: 'SATURDAY', isClosed: i < 3, periods: i < 3 ? [] : ['10:00-16:00'] },
                        { day: 'SUNDAY', isClosed: true, periods: [] },
                    ],
                },
                paymentInfo: {
                    create: {
                        companyName: `${venueData.name} SRL`,
                        address: venueData.address,
                        iban: `IT${String(60 + i).padStart(2, '0')}X0542811101000000${String(123456 + i).padStart(6, '0')}`,
                        bicSwift: 'BPMOIT22XXX',
                        countryCode: 'IT',
                        currencyCode: 'EUR',
                    },
                },
            },
        });
        venues.push(venue);
        
        // Collega il venue all'host corrispondente
        await prisma.user.update({
            where: { id: hosts[i].id },
            data: { venueId: venue.id },
        });
    }
    
    console.log('✅ Created 15 venues');
    
    // 6. Crea packages SOLO per i primi 10 venues
    const packagesTemplates = [
        {
            name: 'Postazione Desk Condivisa',
            description: 'Scrivania in open space con tutti i comfort',
            type: typeCoworking.DESK,
            capacity: 1,
            squareMetres: 2,
            services: ['WiFi', 'Presa Elettrica', 'Lampada'],
            seats: 1,
            plans: [
                { name: 'Oraria', rate: PlansRate.HOURLY, price: 5 },
                { name: 'Giornaliera', rate: PlansRate.DAILY, price: 25 },
                { name: 'Mensile', rate: PlansRate.MONTHLY, price: 300 },
            ],
        },
        {
            name: 'Desk Privato',
            description: 'Postazione riservata con cassettiera',
            type: typeCoworking.DESK,
            capacity: 1,
            squareMetres: 3,
            services: ['WiFi', 'Cassettiera', 'Monitor'],
            seats: 1,
            plans: [
                { name: 'Giornaliera', rate: PlansRate.DAILY, price: 35 },
                { name: 'Settimanale', rate: PlansRate.WEEKLY, price: 150 },
                { name: 'Mensile', rate: PlansRate.MONTHLY, price: 450 },
            ],
        },
        {
            name: 'Sala Riunioni Piccola',
            description: 'Sala per 4-6 persone con proiettore',
            type: typeCoworking.SALA,
            capacity: 6,
            squareMetres: 15,
            services: ['Proiettore', 'Lavagna', 'WiFi', 'Caffè'],
            seats: 6,
            plans: [
                { name: 'Oraria', rate: PlansRate.HOURLY, price: 15 },
                { name: 'Mezza Giornata', rate: PlansRate.DAILY, price: 50 },
            ],
        },
    ];
    
    let totalPackages = 0;
    for (let i = 0; i < 10; i++) {
        for (const template of packagesTemplates) {
            await prisma.package.create({
                data: {
                    name: template.name,
                    description: template.description,
                    type: template.type,
                    capacity: template.capacity,
                    squareMetres: template.squareMetres,
                    services: template.services,
                    photos: [`https://placehold.co/600x400/667eea/ffffff?text=${template.name.replace(/ /g, '+')}`],
                    venueId: venues[i].id,
                    seats: template.seats,
                    isActive: true,
                    plans: {
                        create: template.plans.map(plan => ({
                            name: plan.name,
                            rate: plan.rate,
                            price: plan.price,
                            isEnabled: true,
                        })),
                    },
                },
            });
            totalPackages++;
        }
    }
    
    console.log(`✅ Created ${totalPackages} packages with plans for 10 venues`);
    
    // 7. Crea alcune prenotazioni di esempio
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(18, 0, 0, 0);
    
    const firstPackage = await prisma.package.findFirst({
        where: { venueId: venues[0].id },
    });
    
    if (firstPackage) {
        await prisma.booking.create({
            data: {
                venueId: venues[0].id,
                packageId: firstPackage.id,
                userId: user1.id,
                start: tomorrow,
                end: tomorrowEnd,
                people: 1,
                status: 'CONFIRMED',
                costumerName: 'Anna Ferrari',
                costumerEmail: 'anna.ferrari@example.com',
            },
        });
    }
    
    console.log('✅ Created bookings');
    
    // 8. Aggiungi periodi di chiusura
    const christmasStart = new Date('2025-12-24');
    const christmasEnd = new Date('2025-12-26');
    
    for (let i = 0; i < 10; i++) {
        await prisma.closingPeriod.create({
            data: {
                venueId: venues[i].id,
                start: christmasStart,
                end: christmasEnd,
            },
        });
    }
    
    console.log('✅ Created closing periods');
    
    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- 18 Users created (15 HOSTs, 3 USERs)`);
    console.log(`- 15 Venues created (10 con packages, 5 senza)`);
    console.log(`- ${totalPackages} Packages created with plans`);
    console.log(`- Bookings created`);
    console.log(`- Closing periods created`);
    console.log('\n🔑 Login credentials:');
    console.log('Password for all users: MiaPassword2024!');
    console.log('\nHosts:');
    hostNames.forEach(h => console.log(`- ${h.email}`));
    console.log('\nUsers:');
    console.log('- anna.ferrari@example.com');
    console.log('- giovanni.russo@example.com');
    console.log('- sofia.esposito@example.com');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });