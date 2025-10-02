// src/hooks/usePaymentCalculator.js
import { useState, useEffect, useMemo } from "react";
import { PAYMENT_CONFIG } from "../utils/constants";

export const usePaymentCalculator = (expectedStudentCount = 1) => {
  const [studentCount, setStudentCount] = useState(expectedStudentCount);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [adminFee, setAdminFee] = useState(5000); // Fixed admin fee

  // Calculate pricing breakdown
  const pricing = useMemo(() => {
    const basePrice =
      studentCount * PAYMENT_CONFIG.ASSIGNMENT_PRICE_PER_STUDENT;
    const discountAmount = basePrice * (discount / 100);
    const subtotal = basePrice - discountAmount;
    const taxAmount = subtotal * (tax / 100);
    const total = subtotal + taxAmount + adminFee;

    return {
      basePrice,
      discount: discountAmount,
      subtotal,
      tax: taxAmount,
      adminFee,
      total: Math.round(total),
      pricePerStudent: PAYMENT_CONFIG.ASSIGNMENT_PRICE_PER_STUDENT,
    };
  }, [studentCount, discount, tax, adminFee]);

  // Validation
  const validation = useMemo(() => {
    const errors = [];

    if (studentCount < PAYMENT_CONFIG.MIN_STUDENTS) {
      errors.push(`Minimal ${PAYMENT_CONFIG.MIN_STUDENTS} siswa`);
    }

    if (studentCount > PAYMENT_CONFIG.MAX_STUDENTS) {
      errors.push(`Maksimal ${PAYMENT_CONFIG.MAX_STUDENTS} siswa`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [studentCount]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return {
    studentCount,
    setStudentCount,
    discount,
    setDiscount,
    tax,
    setTax,
    adminFee,
    setAdminFee,
    pricing,
    validation,
    formatCurrency,
  };
};
