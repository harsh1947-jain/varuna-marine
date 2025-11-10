-- =============================================================
-- 🚀 FUEL EU MARITIME COMPLIANCE MODULE - DATABASE INITIALIZATION
-- =============================================================

-- 🧹 DROP EXISTING TABLES
DROP TABLE IF EXISTS pool_members;
DROP TABLE IF EXISTS pools;
DROP TABLE IF EXISTS bank_entries;
DROP TABLE IF EXISTS ship_compliance;
DROP TABLE IF EXISTS routes;

-- =============================================================
-- 🧱 DATABASE SCHEMA
-- =============================================================

CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    route_id VARCHAR(50) NOT NULL,
    vessel_type VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    ghg_intensity FLOAT NOT NULL,
    fuel_consumption_t FLOAT NOT NULL,
    distance_km FLOAT NOT NULL,
    total_emissions_t FLOAT NOT NULL,
    is_baseline BOOLEAN DEFAULT FALSE,
    UNIQUE (route_id, year)
);

CREATE TABLE ship_compliance (
    id SERIAL PRIMARY KEY,
    ship_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    cb_gco2eq FLOAT NOT NULL,
    UNIQUE (ship_id, year)
);

CREATE TABLE bank_entries (
    id SERIAL PRIMARY KEY,
    ship_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    amount_gco2eq FLOAT NOT NULL,
    amount_used FLOAT DEFAULT 0 NOT NULL
);

CREATE TABLE pools (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pool_members (
    pool_id INT REFERENCES pools(id) ON DELETE CASCADE,
    ship_id VARCHAR(50) NOT NULL,
    cb_before FLOAT NOT NULL,
    cb_after FLOAT NOT NULL,
    PRIMARY KEY (pool_id, ship_id)
);

-- =============================================================
-- 🌍 SEED ROUTES — 20 for each year (2024, 2025, 2026)
-- =============================================================

INSERT INTO routes (route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption_t, distance_km, total_emissions_t, is_baseline)
VALUES
-- 2024 (R001–R020)
('R001', 'Container', 'HFO', 2024, 93.5, 5200, 12000, 4600, FALSE),
('R002', 'BulkCarrier', 'LNG', 2024, 87.5, 4800, 11500, 4200, TRUE),
('R003', 'Tanker', 'MGO', 2024, 90.8, 5000, 12500, 4400, FALSE),
('R004', 'RoRo', 'Bio-Methanol', 2024, 74.3, 4700, 11800, 4100, FALSE),
('R005', 'Container', 'Ammonia', 2024, 67.2, 4600, 11600, 4000, FALSE),
('R006', 'Tug', 'HVO', 2024, 80.1, 3100, 9500, 2900, FALSE),
('R007', 'Passenger', 'LNG', 2024, 85.0, 3700, 10000, 3300, FALSE),
('R008', 'BulkCarrier', 'Bio-Methanol', 2024, 72.0, 4100, 10500, 3500, FALSE),
('R009', 'Container', 'HFO', 2024, 91.0, 5000, 12000, 4500, FALSE),
('R010', 'RoRo', 'MGO', 2024, 92.0, 5050, 12100, 4550, FALSE),
('R011', 'Ferry', 'LNG', 2024, 83.0, 3800, 9800, 3400, FALSE),
('R012', 'Cruise', 'Bio-Methanol', 2024, 70.5, 4300, 11000, 3650, FALSE),
('R013', 'Container', 'LPG', 2024, 79.2, 4600, 11900, 4200, FALSE),
('R014', 'Tanker', 'HFO', 2024, 95.1, 5400, 12700, 4750, FALSE),
('R015', 'RoRo', 'LNG', 2024, 82.4, 3900, 10400, 3550, FALSE),
('R016', 'Container', 'Biofuel', 2024, 66.8, 4700, 11700, 4000, FALSE),
('R017', 'BulkCarrier', 'VLSFO', 2024, 89.5, 4950, 11800, 4300, FALSE),
('R018', 'Cruise', 'HFO', 2024, 96.0, 5800, 13000, 4900, FALSE),
('R019', 'Passenger', 'LNG', 2024, 84.0, 4000, 10200, 3450, FALSE),
('R020', 'Tanker', 'HVO', 2024, 78.5, 4600, 11500, 4150, FALSE),

-- 2025 (R021–R040)
('R021', 'Container', 'HFO', 2025, 92.5, 5000, 12000, 4500, FALSE),
('R022', 'BulkCarrier', 'LNG', 2025, 86.5, 4700, 11500, 4150, FALSE),
('R023', 'Tanker', 'MGO', 2025, 91.1, 5100, 12500, 4400, FALSE),
('R024', 'RoRo', 'Bio-Methanol', 2025, 73.0, 4750, 11800, 4050, FALSE),
('R025', 'Container', 'LNG', 2025, 85.3, 4900, 11900, 4200, TRUE),
('R026', 'Tug', 'HVO', 2025, 79.0, 3200, 9400, 2850, FALSE),
('R027', 'Passenger', 'LNG', 2025, 84.5, 3750, 9900, 3300, FALSE),
('R028', 'BulkCarrier', 'Bio-Methanol', 2025, 70.0, 4100, 10600, 3450, FALSE),
('R029', 'Container', 'HFO', 2025, 90.0, 5050, 12100, 4450, FALSE),
('R030', 'RoRo', 'MGO', 2025, 91.5, 5000, 12000, 4400, FALSE),
('R031', 'Ferry', 'LNG', 2025, 82.5, 3800, 9900, 3350, FALSE),
('R032', 'Cruise', 'Bio-Methanol', 2025, 69.0, 4200, 11100, 3600, FALSE),
('R033', 'Container', 'LPG', 2025, 78.0, 4700, 11800, 4150, FALSE),
('R034', 'Tanker', 'HFO', 2025, 94.0, 5500, 12800, 4800, FALSE),
('R035', 'RoRo', 'LNG', 2025, 81.0, 3900, 10400, 3500, FALSE),
('R036', 'Container', 'Biofuel', 2025, 65.0, 4700, 11700, 3900, FALSE),
('R037', 'BulkCarrier', 'VLSFO', 2025, 88.5, 4900, 11900, 4250, FALSE),
('R038', 'Cruise', 'HFO', 2025, 95.5, 5700, 13100, 4850, FALSE),
('R039', 'Passenger', 'LNG', 2025, 83.5, 4050, 10250, 3400, FALSE),
('R040', 'Tanker', 'HVO', 2025, 77.0, 4550, 11400, 4100, FALSE),

-- 2026 (R041–R060)
('R041', 'Container', 'HFO', 2026, 90.5, 5100, 12100, 4500, FALSE),
('R042', 'BulkCarrier', 'LNG', 2026, 85.0, 4600, 11600, 4100, TRUE),
('R043', 'Tanker', 'MGO', 2026, 89.8, 5050, 12600, 4350, FALSE),
('R044', 'RoRo', 'Bio-Methanol', 2026, 71.5, 4700, 11800, 4000, FALSE),
('R045', 'Container', 'LNG', 2026, 83.0, 4800, 11900, 4150, FALSE),
('R046', 'Tug', 'HVO', 2026, 78.0, 3150, 9400, 2800, FALSE),
('R047', 'Passenger', 'LNG', 2026, 82.0, 3700, 9900, 3300, FALSE),
('R048', 'BulkCarrier', 'Bio-Methanol', 2026, 69.5, 4100, 10600, 3450, FALSE),
('R049', 'Container', 'HFO', 2026, 89.0, 5000, 12100, 4400, FALSE),
('R050', 'RoRo', 'MGO', 2026, 90.0, 5000, 12000, 4350, FALSE),
('R051', 'Ferry', 'LNG', 2026, 80.5, 3800, 9800, 3300, FALSE),
('R052', 'Cruise', 'Bio-Methanol', 2026, 68.0, 4200, 11100, 3550, FALSE),
('R053', 'Container', 'LPG', 2026, 77.0, 4700, 11800, 4100, FALSE),
('R054', 'Tanker', 'HFO', 2026, 93.0, 5500, 12800, 4750, FALSE),
('R055', 'RoRo', 'LNG', 2026, 80.0, 3900, 10400, 3450, FALSE),
('R056', 'Container', 'Biofuel', 2026, 64.0, 4700, 11700, 3850, FALSE),
('R057', 'BulkCarrier', 'VLSFO', 2026, 87.0, 4950, 11900, 4200, FALSE),
('R058', 'Cruise', 'HFO', 2026, 94.0, 5700, 13100, 4800, FALSE),
('R059', 'Passenger', 'LNG', 2026, 82.5, 4050, 10250, 3350, FALSE),
('R060', 'Tanker', 'HVO', 2026, 76.0, 4500, 11400, 4050, FALSE);

-- =============================================================
-- 🧮 COMPLIANCE BALANCES (one per route)
-- =============================================================

INSERT INTO ship_compliance (ship_id, year, cb_gco2eq)
SELECT route_id, year, 
CASE
    WHEN random() > 0.6 THEN (floor(random() * 500) + 100)  -- surplus
    ELSE -(floor(random() * 400) + 50)                      -- deficit
END
FROM routes;

-- =============================================================
-- 🏦 BANKED SURPLUSES (10 random)
-- =============================================================

INSERT INTO bank_entries (ship_id, year, amount_gco2eq, amount_used)
SELECT route_id, year, (floor(random() * 200) + 50), (floor(random() * 50))
FROM routes
WHERE id % 3 = 0;  -- roughly 10 ships

-- =============================================================
-- 🧾 SAMPLE POOLS (3 years)
-- =============================================================
INSERT INTO pools (year) VALUES (2024), (2025), (2026);

-- Simulated pooled members (some surplus balancing)
INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after)
SELECT 
    1 + floor((id - 1)/20),  -- year-based pool
    route_id,
    (floor(random() * 400) - 200),  -- random before
    (floor(random() * 200))         -- random after
FROM routes;

-- =============================================================
-- ✅ CHECK DATA
-- =============================================================
SELECT '✅ Database initialized with 60 routes (2024–2026), compliance, banking, and pooling data.' AS status;
