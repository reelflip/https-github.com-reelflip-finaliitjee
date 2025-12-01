import React, { useState, useEffect } from 'react';
import { Subject, Topic, TopicStatus } from '../types';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Clock, PenTool, Eye } from 'lucide-react';

interface SyllabusProps {
  readOnly?: boolean;
}

const INITIAL_SYLLABUS: Subject[] = [
  {
    id: 1,
    name: 'Mathematics',
    chapters: [
      { id: 301, name: 'UNIT 1: Sets, Relations and Functions', phase: 'Maths', topics: [{ id: 3011, name: 'Sets, Relations & Functions', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 302, name: 'UNIT 2: Complex Numbers and Quadratic Equations', phase: 'Maths', topics: [{ id: 3021, name: 'Complex Numbers', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }, { id: 3022, name: 'Quadratic Equations', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 303, name: 'UNIT 3: Matrices and Determinants', phase: 'Maths', topics: [{ id: 3031, name: 'Matrices & Determinants', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 35, ex3_total: 25, ex4_total: 10 } }] },
      { id: 304, name: 'UNIT 4: Permutations and Combinations', phase: 'Maths', topics: [{ id: 3041, name: 'Permutations & Combinations', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } }] },
      { id: 305, name: 'UNIT 5: Binomial Theorem', phase: 'Maths', topics: [{ id: 3051, name: 'Binomial Theorem', status: 'not_started', estHours: 7, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } }] },
      { id: 306, name: 'UNIT 6: Sequence and Series', phase: 'Maths', topics: [{ id: 3061, name: 'Sequence and Series', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 15, ex4_total: 10 } }] },
      { id: 307, name: 'UNIT 7: Limit, Continuity and Differentiability', phase: 'Maths', topics: [{ id: 3071, name: 'Limits & Continuity', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }, { id: 3072, name: 'Differentiation', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }, { id: 3073, name: 'Applications of Derivatives', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 40, ex3_total: 25, ex4_total: 15 } }] },
      { id: 308, name: 'UNIT 8: Integral Calculus', phase: 'Maths', topics: [{ id: 3081, name: 'Indefinite Integration', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 40, ex3_total: 25, ex4_total: 15 } }, { id: 3082, name: 'Definite Integration', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 25, ex4_total: 15 } }] },
      { id: 309, name: 'UNIT 9: Differential Equations', phase: 'Maths', topics: [{ id: 3091, name: 'Differential Equations', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 310, name: 'UNIT 10: Co-ordinate Geometry', phase: 'Maths', topics: [{ id: 3101, name: 'Straight Lines', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } }, { id: 3102, name: 'Circles', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }, { id: 3103, name: 'Conic Sections', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 60, ex2_total: 40, ex3_total: 30, ex4_total: 15 } }] },
      { id: 311, name: 'UNIT 11: Three Dimensional Geometry', phase: 'Maths', topics: [{ id: 3111, name: '3D Geometry', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 312, name: 'UNIT 12: Vector Algebra', phase: 'Maths', topics: [{ id: 3121, name: 'Vector Algebra', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 313, name: 'UNIT 13: Statistics and Probability', phase: 'Maths', topics: [{ id: 3131, name: 'Statistics', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } }, { id: 3132, name: 'Probability', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 314, name: 'UNIT 14: Trigonometry', phase: 'Maths', topics: [{ id: 3141, name: 'Trigonometry', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } }] },
    ]
  },
  {
    id: 2,
    name: 'Physics',
    chapters: [
      { id: 101, name: 'UNIT 1: Units and Measurements', phase: 'Physics', topics: [{ id: 1011, name: 'Units & Measurements', status: 'not_started', estHours: 4, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } }] },
      { id: 102, name: 'UNIT 2: Kinematics', phase: 'Physics', topics: [{ id: 1021, name: 'Kinematics', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 103, name: 'UNIT 3: Laws of Motion', phase: 'Physics', topics: [{ id: 1031, name: 'Laws of Motion', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 104, name: 'UNIT 4: Work, Energy and Power', phase: 'Physics', topics: [{ id: 1041, name: 'Work, Energy & Power', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 10 } }] },
      { id: 105, name: 'UNIT 5: Rotational Motion', phase: 'Physics', topics: [{ id: 1051, name: 'Rotational Motion', status: 'not_started', estHours: 18, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 60, ex2_total: 40, ex3_total: 30, ex4_total: 15 } }] },
      { id: 106, name: 'UNIT 6: Gravitation', phase: 'Physics', topics: [{ id: 1061, name: 'Gravitation', status: 'not_started', estHours: 7, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } }] },
      { id: 107, name: 'UNIT 7: Properties of Solids and Liquids', phase: 'Physics', topics: [{ id: 1071, name: 'Properties of Solids & Liquids', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 108, name: 'UNIT 8: Thermodynamics', phase: 'Physics', topics: [{ id: 1081, name: 'Thermodynamics', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 10 } }] },
      { id: 109, name: 'UNIT 9: Kinetic Theory of Gases', phase: 'Physics', topics: [{ id: 1091, name: 'KTG', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } }] },
      { id: 110, name: 'UNIT 10: Oscillations and Waves', phase: 'Physics', topics: [{ id: 1101, name: 'Oscillations (SHM)', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }, { id: 1102, name: 'Waves', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } }] },
      { id: 111, name: 'UNIT 11: Electrostatics', phase: 'Physics', topics: [{ id: 1111, name: 'Electrostatics', status: 'not_started', estHours: 16, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 60, ex2_total: 40, ex3_total: 25, ex4_total: 15 } }] },
      { id: 112, name: 'UNIT 12: Current Electricity', phase: 'Physics', topics: [{ id: 1121, name: 'Current Electricity', status: 'not_started', estHours: 14, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 25, ex4_total: 10 } }] },
      { id: 113, name: 'UNIT 13: Magnetic Effects of Current and Magnetism', phase: 'Physics', topics: [{ id: 1131, name: 'Moving Charges & Magnetism', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }, { id: 1132, name: 'Magnetism & Matter', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 25, ex2_total: 15, ex3_total: 10, ex4_total: 5 } }] },
      { id: 114, name: 'UNIT 14: Electromagnetic Induction and AC', phase: 'Physics', topics: [{ id: 1141, name: 'EMI', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 10 } }, { id: 1142, name: 'Alternating Current', status: 'not_started', estHours: 7, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } }] },
      { id: 115, name: 'UNIT 15: Electromagnetic Waves', phase: 'Physics', topics: [{ id: 1151, name: 'EM Waves', status: 'not_started', estHours: 4, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 25, ex2_total: 15, ex3_total: 10, ex4_total: 5 } }] },
      { id: 116, name: 'UNIT 16: Optics', phase: 'Physics', topics: [{ id: 1161, name: 'Ray Optics', status: 'not_started', estHours: 14, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } }, { id: 1162, name: 'Wave Optics', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 10 } }] },
      { id: 117, name: 'UNIT 17: Dual Nature of Matter and Radiation', phase: 'Physics', topics: [{ id: 1171, name: 'Dual Nature of Matter', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } }] },
      { id: 118, name: 'UNIT 18: Atoms and Nuclei', phase: 'Physics', topics: [{ id: 1181, name: 'Atoms & Nuclei', status: 'not_started', estHours: 7, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } }] },
      { id: 119, name: 'UNIT 19: Electronic Devices', phase: 'Physics', topics: [{ id: 1191, name: 'Semiconductors', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } }] },
      { id: 120, name: 'UNIT 20: Experimental Skills', phase: 'Physics', topics: [{ id: 1201, name: 'Experimental Physics', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 20, ex2_total: 10, ex3_total: 5, ex4_total: 0 } }] },
    ]
  },
  {
    id: 3,
    name: 'Chemistry',
    chapters: [
      { id: 201, name: 'UNIT 1: Some Basic Concepts in Chemistry', phase: 'Physical Chem', topics: [{ id: 2011, name: 'Mole Concept', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 15, ex4_total: 10 } }] },
      { id: 202, name: 'UNIT 2: Atomic Structure', phase: 'Physical Chem', topics: [{ id: 2021, name: 'Atomic Structure', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 203, name: 'UNIT 3: Chemical Bonding and Molecular Structure', phase: 'Physical Chem', topics: [{ id: 2031, name: 'Chemical Bonding', status: 'not_started', estHours: 14, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 60, ex2_total: 40, ex3_total: 25, ex4_total: 15 } }] },
      { id: 204, name: 'UNIT 4: Chemical Thermodynamics', phase: 'Physical Chem', topics: [{ id: 2041, name: 'Thermodynamics', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 205, name: 'UNIT 5: Solutions', phase: 'Physical Chem', topics: [{ id: 2051, name: 'Solutions', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 10 } }] },
      { id: 206, name: 'UNIT 6: Equilibrium', phase: 'Physical Chem', topics: [{ id: 2061, name: 'Chemical & Ionic Equilibrium', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } }] },
      { id: 207, name: 'UNIT 7: Redox Reactions and Electrochemistry', phase: 'Physical Chem', topics: [{ id: 2071, name: 'Redox & Electrochemistry', status: 'not_started', estHours: 11, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } }] },
      { id: 208, name: 'UNIT 8: Chemical Kinetics', phase: 'Physical Chem', topics: [{ id: 2081, name: 'Chemical Kinetics', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 209, name: 'UNIT 9: Classification of Elements', phase: 'Inorganic Chem', topics: [{ id: 2091, name: 'Periodic Table', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } }] },
      { id: 210, name: 'UNIT 10: p-Block Elements', phase: 'Inorganic Chem', topics: [{ id: 2101, name: 'p-Block Elements', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 211, name: 'UNIT 11: d- and f- Block Elements', phase: 'Inorganic Chem', topics: [{ id: 2111, name: 'd & f Block', status: 'not_started', estHours: 7, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } }] },
      { id: 212, name: 'UNIT 12: Coordination Compounds', phase: 'Inorganic Chem', topics: [{ id: 2121, name: 'Coordination Compounds', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } }] },
      { id: 213, name: 'UNIT 13: Purification and Characterisation', phase: 'Organic Chem', topics: [{ id: 2131, name: 'Purification Techniques', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 25, ex2_total: 15, ex3_total: 10, ex4_total: 5 } }] },
      { id: 214, name: 'UNIT 14: Some Basic Principles of Organic Chemistry', phase: 'Organic Chem', topics: [{ id: 2141, name: 'GOC & Isomerism', status: 'not_started', estHours: 15, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 60, ex2_total: 40, ex3_total: 25, ex4_total: 15 } }] },
      { id: 215, name: 'UNIT 15: Hydrocarbons', phase: 'Organic Chem', topics: [{ id: 2151, name: 'Hydrocarbons', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }] },
      { id: 216, name: 'UNIT 16: Organic Compounds Containing Halogens', phase: 'Organic Chem', topics: [{ id: 2161, name: 'Haloalkanes & Haloarenes', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 5 } }] },
      { id: 217, name: 'UNIT 17: Organic Compounds Containing Oxygen', phase: 'Organic Chem', topics: [{ id: 2171, name: 'Alcohols, Phenols, Ethers', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } }, { id: 2172, name: 'Aldehydes, Ketones, Acids', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 55, ex2_total: 40, ex3_total: 25, ex4_total: 15 } }] },
      { id: 218, name: 'UNIT 18: Organic Compounds Containing Nitrogen', phase: 'Organic Chem', topics: [{ id: 2181, name: 'Amines', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } }] },
      { id: 219, name: 'UNIT 19: Biomolecules', phase: 'Organic Chem', topics: [{ id: 2191, name: 'Biomolecules', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } }] },
      { id: 220, name: 'UNIT 20: Principles Related to Practical Chemistry', phase: 'Practical Chem', topics: [{ id: 2201, name: 'Practical Chemistry', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 15, ex3_total: 10, ex4_total: 5 } }] },
    ]
  }
];

const StatusBadge: React.FC<{ status: TopicStatus }> = ({ status }) => {
  const styles = {
    not_started: 'bg-slate-100 text-slate-500',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    revision_required: 'bg-orange-100 text-orange-700',
  };
  
  const labels = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed',
    revision_required: 'Revise',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const Syllabus: React.FC<SyllabusProps> = ({ readOnly = false }) => {
  const [syllabus, setSyllabus] = useState<Subject[]>(INITIAL_SYLLABUS);
  const [activeSubject, setActiveSubject] = useState<number>(1);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([301, 101, 201]);

  // Simulate data fetching for Parents (Read-Only Mode)
  useEffect(() => {
    if (readOnly) {
      // Simulate randomization to show student progress
      const simulatedSyllabus = INITIAL_SYLLABUS.map(subject => ({
        ...subject,
        chapters: subject.chapters.map(chapter => ({
          ...chapter,
          topics: chapter.topics.map(topic => {
             // Random status
             const statuses: TopicStatus[] = ['not_started', 'in_progress', 'completed', 'revision_required'];
             const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
             
             // Random exercises
             const ex1 = Math.floor(Math.random() * 20);
             const ex2 = Math.floor(Math.random() * 10);
             
             return {
                ...topic,
                status: randomStatus,
                exercises: {
                    ...topic.exercises,
                    ex1: ex1,
                    ex2: ex2
                }
             };
          })
        }))
      }));
      setSyllabus(simulatedSyllabus);
    }
  }, [readOnly]);

  const toggleChapter = (id: number) => {
    setExpandedChapters(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const updateStatus = (chapterId: number, topicId: number, newStatus: TopicStatus) => {
    if (readOnly) return;
    const updated = syllabus.map(subject => ({
      ...subject,
      chapters: subject.chapters.map(chapter => {
        if (chapter.id !== chapterId) return chapter;
        return {
          ...chapter,
          topics: chapter.topics.map(topic => {
            if (topic.id !== topicId) return topic;
            return { ...topic, status: newStatus };
          })
        };
      })
    }));
    setSyllabus(updated);
  };

  const updateExercise = (chapterId: number, topicId: number, exercise: keyof Topic['exercises'], value: string) => {
    if (readOnly) return;
    const intVal = Math.max(0, parseInt(value) || 0);
    const updated = syllabus.map(subject => ({
      ...subject,
      chapters: subject.chapters.map(chapter => {
        if (chapter.id !== chapterId) return chapter;
        return {
          ...chapter,
          topics: chapter.topics.map(topic => {
            if (topic.id !== topicId) return topic;
            return {
              ...topic,
              exercises: {
                ...topic.exercises,
                [exercise]: intVal
              }
            };
          })
        };
      })
    }));
    setSyllabus(updated);
  };

  const currentSubject = syllabus.find(s => s.id === activeSubject);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">JEE Main 2025 Syllabus Tracker</h2>
           <p className="text-slate-500">Official syllabus with 14 Maths, 20 Physics, and 20 Chemistry Units.</p>
        </div>
        {readOnly && (
            <div className="bg-purple-100 border border-purple-200 text-purple-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <Eye size={16} />
                Viewing Student Progress (Read-Only)
            </div>
        )}
      </div>

      {/* Subject Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        {syllabus.map(sub => (
          <button
            key={sub.id}
            onClick={() => setActiveSubject(sub.id)}
            className={`pb-3 px-4 text-sm font-medium transition-all relative ${
              activeSubject === sub.id 
                ? 'text-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {sub.name}
            {activeSubject === sub.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      {/* Chapters List */}
      <div className="space-y-4">
        {currentSubject?.chapters.map(chapter => (
          <div key={chapter.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedChapters.includes(chapter.id) ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                <div className="text-left">
                  <h3 className="font-semibold text-slate-800 text-sm md:text-base">{chapter.name}</h3>
                  <span className="text-[10px] text-slate-500 bg-white border px-2 py-0.5 rounded uppercase font-bold">{chapter.phase}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>{chapter.topics.filter(t => t.status === 'completed').length}/{chapter.topics.length} Topics</span>
              </div>
            </button>

            {expandedChapters.includes(chapter.id) && (
              <div className="divide-y divide-slate-100">
                {chapter.topics.map(topic => (
                  <div key={topic.id} className="p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    
                    {/* Topic Info */}
                    <div className="flex items-center gap-3 min-w-[250px]">
                      {topic.status === 'completed' 
                        ? <CheckCircle2 size={20} className="text-green-500" />
                        : topic.status === 'revision_required'
                        ? <Circle size={20} className="text-orange-500" />
                        : <Circle size={20} className="text-slate-300" />
                      }
                      <div>
                        <p className="font-medium text-slate-700">{topic.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> Est. {topic.estHours} hrs
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Exercise Inputs */}
                        <div className={`flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 overflow-x-auto max-w-full ${readOnly ? 'opacity-80' : ''}`}>
                             <div className="flex items-center gap-1 text-slate-400 mr-2 border-r border-slate-200 pr-2 shrink-0">
                                <PenTool size={12} />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold uppercase leading-none">Solved</span>
                                    <span className="text-[9px] font-bold uppercase leading-none text-slate-300">Total</span>
                                </div>
                             </div>
                             {(['ex1', 'ex2', 'ex3', 'ex4'] as const).map((ex, idx) => {
                                 const totalKey = `${ex}_total` as keyof Topic['exercises'];
                                 return (
                                    <div key={ex} className="flex flex-col items-center gap-1 shrink-0">
                                        <label className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">Ex {idx+1}</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            disabled={readOnly}
                                            className="w-10 h-6 text-center text-xs border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all bg-white disabled:bg-slate-50 disabled:text-slate-500"
                                            value={topic.exercises[ex] || ''}
                                            onChange={(e) => updateExercise(chapter.id, topic.id, ex, e.target.value)}
                                            onClick={(e) => (e.target as HTMLInputElement).select()}
                                            title="Solved"
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            disabled={readOnly}
                                            className="w-10 h-6 text-center text-[10px] border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all bg-slate-100 text-slate-500 disabled:opacity-70"
                                            value={topic.exercises[totalKey] || ''}
                                            onChange={(e) => updateExercise(chapter.id, topic.id, totalKey, e.target.value)}
                                            onClick={(e) => (e.target as HTMLInputElement).select()}
                                            title="Total Questions"
                                        />
                                    </div>
                                 );
                             })}
                        </div>

                        {/* Status Dropdown */}
                        <div className="flex items-center gap-3 shrink-0">
                        <select 
                            value={topic.status}
                            disabled={readOnly}
                            onChange={(e) => updateStatus(chapter.id, topic.id, e.target.value as TopicStatus)}
                            className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                        >
                            <option value="not_started">Not Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="revision_required">Revise</option>
                        </select>
                        <StatusBadge status={topic.status} />
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Syllabus;