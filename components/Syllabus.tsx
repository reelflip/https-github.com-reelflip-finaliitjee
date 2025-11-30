import React, { useState } from 'react';
import { Subject, Topic, TopicStatus } from '../types';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Clock, PenTool } from 'lucide-react';

const INITIAL_SYLLABUS: Subject[] = [
  {
    id: 1,
    name: 'Physics',
    chapters: [
      {
        id: 101,
        name: 'General Physics (Class 11)',
        phase: 'Phase 1',
        topics: [
          { id: 1011, name: 'Units and Dimensions', status: 'completed', estHours: 4, exercises: { ex1: 10, ex2: 5, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 10 } },
          { id: 1012, name: 'Errors & Measurements', status: 'completed', estHours: 3, exercises: { ex1: 15, ex2: 10, ex3: 5, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 10 } },
          { id: 1013, name: 'Vectors', status: 'completed', estHours: 5, exercises: { ex1: 20, ex2: 15, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 10 } },
        ]
      },
      {
        id: 102,
        name: 'Mechanics (Class 11)',
        phase: 'Phase 1',
        topics: [
          { id: 1021, name: 'Kinematics (1D & 2D)', status: 'in_progress', estHours: 12, exercises: { ex1: 25, ex2: 10, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
          { id: 1022, name: 'Newton\'s Laws of Motion', status: 'in_progress', estHours: 10, exercises: { ex1: 10, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 15, ex4_total: 10 } },
          { id: 1023, name: 'Friction', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } },
          { id: 1024, name: 'Work, Energy, and Power', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 10 } },
          { id: 1025, name: 'Circular Motion', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } },
          { id: 1026, name: 'Center of Mass & Collisions', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 15, ex4_total: 10 } },
          { id: 1027, name: 'Rotational Motion', status: 'revision_required', estHours: 18, exercises: { ex1: 30, ex2: 25, ex3: 10, ex4: 5, ex1_total: 60, ex2_total: 40, ex3_total: 25, ex4_total: 15 } },
          { id: 1028, name: 'Gravitation', status: 'not_started', estHours: 7, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 10, ex4_total: 5 } },
          { id: 1029, name: 'Fluid Mechanics', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 15, ex4_total: 10 } },
        ]
      },
      {
        id: 103,
        name: 'Thermal Physics (Class 11)',
        phase: 'Phase 1',
        topics: [
          { id: 1031, name: 'Thermal Expansion & Calorimetry', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 25, ex2_total: 15, ex3_total: 10, ex4_total: 5 } },
          { id: 1032, name: 'Thermodynamics', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 10 } },
          { id: 1033, name: 'Kinetic Theory of Gases', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } },
          { id: 1034, name: 'Heat Transfer', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } },
        ]
      },
      {
        id: 104,
        name: 'Oscillations & Waves (Class 11)',
        phase: 'Phase 1',
        topics: [
          { id: 1041, name: 'Simple Harmonic Motion (SHM)', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
          { id: 1042, name: 'Waves & Sound', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } },
        ]
      },
      {
        id: 105,
        name: 'Electrodynamics (Class 12)',
        phase: 'Phase 2',
        topics: [
          { id: 1051, name: 'Electrostatics', status: 'not_started', estHours: 16, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 60, ex2_total: 40, ex3_total: 25, ex4_total: 15 } },
          { id: 1052, name: 'Capacitance', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } },
          { id: 1053, name: 'Current Electricity', status: 'not_started', estHours: 14, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } },
          { id: 1054, name: 'Moving Charges & Magnetism', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 15, ex4_total: 10 } },
          { id: 1055, name: 'Magnetism & Matter', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 25, ex2_total: 15, ex3_total: 10, ex4_total: 5 } },
          { id: 1056, name: 'Electromagnetic Induction (EMI)', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 10 } },
          { id: 1057, name: 'Alternating Current (AC)', status: 'not_started', estHours: 7, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } },
        ]
      },
      {
        id: 106,
        name: 'Optics & Modern Physics (Class 12)',
        phase: 'Phase 2',
        topics: [
          { id: 1061, name: 'Ray Optics', status: 'not_started', estHours: 14, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } },
          { id: 1062, name: 'Wave Optics', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 10 } },
          { id: 1063, name: 'Dual Nature of Matter', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } },
          { id: 1064, name: 'Atoms & Nuclei', status: 'not_started', estHours: 7, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 10, ex4_total: 5 } },
          { id: 1065, name: 'Semiconductors', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Chemistry',
    chapters: [
      {
        id: 201,
        name: 'Physical Chemistry (Class 11)',
        phase: 'Phase 1',
        topics: [
          { id: 2011, name: 'Mole Concept', status: 'completed', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
          { id: 2012, name: 'Atomic Structure', status: 'completed', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
          { id: 2013, name: 'Gaseous State', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
          { id: 2014, name: 'Chemical Equilibrium', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 15, ex4_total: 10 } },
          { id: 2015, name: 'Ionic Equilibrium', status: 'revision_required', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } },
          { id: 2016, name: 'Thermodynamics', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
          { id: 2017, name: 'Redox Reactions', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } },
        ]
      },
      {
        id: 202,
        name: 'Inorganic Chemistry (Class 11)',
        phase: 'Phase 1',
        topics: [
          { id: 2021, name: 'Periodic Table', status: 'in_progress', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
          { id: 2022, name: 'Chemical Bonding', status: 'in_progress', estHours: 14, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 60, ex2_total: 40, ex3_total: 25, ex4_total: 15 } },
          { id: 2023, name: 'Hydrogen & s-Block', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } },
          { id: 2024, name: 'p-Block Elements (Group 13, 14)', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
        ]
      },
      {
        id: 203,
        name: 'Organic Chemistry (Class 11)',
        phase: 'Phase 1',
        topics: [
          { id: 2031, name: 'GOC (General Organic Chem)', status: 'revision_required', estHours: 15, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 60, ex2_total: 40, ex3_total: 25, ex4_total: 15 } },
          { id: 2032, name: 'Isomerism', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 15, ex4_total: 5 } },
          { id: 2033, name: 'Hydrocarbons', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
        ]
      },
      {
        id: 204,
        name: 'Physical Chemistry (Class 12)',
        phase: 'Phase 2',
        topics: [
          { id: 2041, name: 'Solid State', status: 'not_started', estHours: 7, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
          { id: 2042, name: 'Solutions', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 10 } },
          { id: 2043, name: 'Electrochemistry', status: 'not_started', estHours: 11, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } },
          { id: 2044, name: 'Chemical Kinetics', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
          { id: 2045, name: 'Surface Chemistry', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } },
        ]
      },
      {
        id: 205,
        name: 'Inorganic Chemistry (Class 12)',
        phase: 'Phase 2',
        topics: [
          { id: 2051, name: 'Metallurgy', status: 'not_started', estHours: 5, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } },
          { id: 2052, name: 'p-Block (Group 15-18)', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
          { id: 2053, name: 'd and f Block Elements', status: 'not_started', estHours: 7, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
          { id: 2054, name: 'Coordination Compounds', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } },
        ]
      },
      {
        id: 206,
        name: 'Organic Chemistry (Class 12)',
        phase: 'Phase 2',
        topics: [
          { id: 2061, name: 'Haloalkanes & Haloarenes', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
          { id: 2062, name: 'Alcohols, Phenols, Ethers', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
          { id: 2063, name: 'Aldehydes, Ketones, Carboxylic Acids', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 55, ex2_total: 40, ex3_total: 25, ex4_total: 15 } },
          { id: 2064, name: 'Amines', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
          { id: 2065, name: 'Biomolecules & Polymers', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Mathematics',
    chapters: [
      {
        id: 301,
        name: 'Algebra (Class 11)',
        phase: 'Phase 1',
        topics: [
          { id: 3011, name: 'Sets, Relations & Functions', status: 'in_progress', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 15, ex4_total: 5 } },
          { id: 3012, name: 'Trigonometric Ratios', status: 'in_progress', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } },
          { id: 3013, name: 'Quadratic Equations', status: 'completed', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
          { id: 3014, name: 'Complex Numbers', status: 'completed', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
          { id: 3015, name: 'Sequence & Series', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 15, ex4_total: 10 } },
          { id: 3016, name: 'Permutations & Combinations', status: 'revision_required', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } },
          { id: 3017, name: 'Binomial Theorem', status: 'not_started', estHours: 7, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
        ]
      },
      {
        id: 302,
        name: 'Coordinate Geometry (Class 11)',
        phase: 'Phase 1',
        topics: [
          { id: 3021, name: 'Straight Lines', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } },
          { id: 3022, name: 'Circles', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
          { id: 3023, name: 'Parabola', status: 'not_started', estHours: 7, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
          { id: 3024, name: 'Ellipse & Hyperbola', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
        ]
      },
      {
        id: 303,
        name: 'Calculus (Class 11 & 12)',
        phase: 'Phase 2',
        topics: [
          { id: 3031, name: 'Limits, Continuity & Differentiability', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 55, ex2_total: 40, ex3_total: 25, ex4_total: 15 } },
          { id: 3032, name: 'Differentiation', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
          { id: 3033, name: 'Applications of Derivatives (AOD)', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 60, ex2_total: 40, ex3_total: 25, ex4_total: 15 } },
          { id: 3034, name: 'Indefinite Integration', status: 'not_started', estHours: 12, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 60, ex2_total: 45, ex3_total: 30, ex4_total: 15 } },
          { id: 3035, name: 'Definite Integration', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 25, ex4_total: 15 } },
          { id: 3036, name: 'Area Under Curve', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 30, ex2_total: 20, ex3_total: 10, ex4_total: 5 } },
          { id: 3037, name: 'Differential Equations', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 40, ex2_total: 30, ex3_total: 15, ex4_total: 10 } },
        ]
      },
      {
        id: 304,
        name: 'Algebra & Vectors (Class 12)',
        phase: 'Phase 2',
        topics: [
          { id: 3041, name: 'Matrices & Determinants', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 20, ex4_total: 10 } },
          { id: 3042, name: 'Probability', status: 'not_started', estHours: 9, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
          { id: 3043, name: 'Vector Algebra', status: 'not_started', estHours: 8, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 45, ex2_total: 30, ex3_total: 20, ex4_total: 10 } },
          { id: 3044, name: '3D Geometry', status: 'not_started', estHours: 10, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 50, ex2_total: 35, ex3_total: 25, ex4_total: 15 } },
          { id: 3045, name: 'Inverse Trigonometric Functions', status: 'not_started', estHours: 6, exercises: { ex1: 0, ex2: 0, ex3: 0, ex4: 0, ex1_total: 35, ex2_total: 25, ex3_total: 15, ex4_total: 5 } },
        ]
      }
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

const Syllabus: React.FC = () => {
  const [syllabus, setSyllabus] = useState<Subject[]>(INITIAL_SYLLABUS);
  const [activeSubject, setActiveSubject] = useState<number>(1);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([101, 102]);

  const toggleChapter = (id: number) => {
    setExpandedChapters(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const updateStatus = (chapterId: number, topicId: number, newStatus: TopicStatus) => {
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
           <h2 className="text-2xl font-bold text-slate-800">Syllabus Tracker</h2>
           <p className="text-slate-500">Track your progress and exercises chapter by chapter.</p>
        </div>
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
                  <h3 className="font-semibold text-slate-800">{chapter.name}</h3>
                  <span className="text-xs text-slate-500 bg-white border px-2 py-0.5 rounded">{chapter.phase}</span>
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
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                             <div className="flex items-center gap-1 text-slate-400 mr-2 border-r border-slate-200 pr-2">
                                <PenTool size={12} />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold uppercase leading-none">Solved</span>
                                    <span className="text-[9px] font-bold uppercase leading-none text-slate-300">Total</span>
                                </div>
                             </div>
                             {(['ex1', 'ex2', 'ex3', 'ex4'] as const).map((ex, idx) => {
                                 const totalKey = `${ex}_total` as keyof Topic['exercises'];
                                 return (
                                    <div key={ex} className="flex flex-col items-center gap-1">
                                        <label className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">Ex {idx+1}</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            className="w-10 h-6 text-center text-xs border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all bg-white"
                                            value={topic.exercises[ex] || ''}
                                            onChange={(e) => updateExercise(chapter.id, topic.id, ex, e.target.value)}
                                            onClick={(e) => (e.target as HTMLInputElement).select()}
                                            title="Solved"
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            className="w-10 h-6 text-center text-[10px] border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all bg-slate-100 text-slate-500"
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
                        <div className="flex items-center gap-3">
                        <select 
                            value={topic.status}
                            onChange={(e) => updateStatus(chapter.id, topic.id, e.target.value as TopicStatus)}
                            className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
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