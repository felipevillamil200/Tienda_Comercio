'use client';

import React from 'react';

export default function AdminStyles() {
  return (
    <style jsx global>{`
      .admin-root {
        min-height: 100vh;
        background: #08080a;
        color: #f5f5f7;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        padding: 0;
        margin: 0;
        max-width: 100%;
      }

      /* 2-Column App Layout */
      .admin-app-layout {
        display: flex;
        min-height: 100vh;
        width: 100%;
      }

      /* Left Sidebar */
      .admin-sidebar {
        width: 270px;
        min-width: 250px;
        background: #060608;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 24px 16px;
        position: sticky;
        top: 0;
        height: 100vh;
        overflow-y: auto;
        box-sizing: border-box;
        z-index: 10;
      }

      /* Main Content Area */
      .admin-main-area {
        flex: 1;
        min-width: 0;
        padding: 32px 36px;
        background: radial-gradient(circle at 50% 0%, #151319 0%, #0c0b0f 50%, #070709 100%);
        overflow-y: auto;
        box-sizing: border-box;
      }

      /* Sidebar Header */
      .admin-sidebar-header {
        padding: 0 6px;
        margin-bottom: 20px;
      }
      .admin-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #ff5500;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.8px;
        margin-bottom: 4px;
      }
      .admin-title {
        font-family: var(--font-display, Georgia, serif);
        font-size: 1.25rem;
        font-weight: 900;
        margin: 0;
        letter-spacing: 0.02em;
        color: #ffffff;
      }
      .admin-sidebar-subtitle {
        font-size: 11px;
        color: #71717a;
        margin: 2px 0 0;
      }

      /* Admin Identity Card */
      .admin-user-card {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 10px 12px;
        border-radius: 8px;
        margin-bottom: 20px;
      }
      .admin-user-avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: #18181b;
        border: 2px solid #ff5500;
        color: #ff7733;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 13px;
        box-shadow: 0 0 10px rgba(255, 85, 0, 0.3);
        flex-shrink: 0;
      }
      .admin-user-details {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .admin-user-name {
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .admin-user-pill {
        background: rgba(34, 197, 94, 0.18);
        color: #4ade80;
        border: 1px solid rgba(34, 197, 94, 0.3);
        font-size: 8px;
        font-weight: 900;
        padding: 1px 5px;
        border-radius: 6px;
      }
      .admin-user-email {
        font-size: 10px;
        color: #a1a1aa;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Sidebar Navigation */
      .admin-sidebar-nav {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .admin-nav-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 11px 12px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: #a1a1aa;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.18s ease;
        text-align: left;
        width: 100%;
      }
      .admin-nav-btn:hover {
        background: rgba(255, 255, 255, 0.04);
        color: #ffffff;
      }
      .admin-nav-btn.active {
        background: rgba(255, 85, 0, 0.14);
        color: #ffffff;
        font-weight: 800;
        border-left: 3px solid #ff5500;
      }
      .admin-nav-btn-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      /* Sidebar Footer & Actions */
      .admin-sidebar-footer {
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .admin-sidebar-actions-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 6px;
      }
      .btn-action-ghost-mini {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #d4d4d8 !important;
        padding: 8px 4px;
        font-size: 10px;
        font-weight: 700;
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
        isolation: isolate;
        text-decoration: none;
        text-align: center;
        transition: color 240ms ease, transform 240ms cubic-bezier(0.16, 1, 0.3, 1), border-color 240ms ease, box-shadow 240ms ease;
      }
      .btn-action-ghost-mini::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background: #ff5500;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .btn-action-ghost-mini > * {
        position: relative;
        z-index: 2;
      }
      .btn-action-ghost-mini:hover {
        transform: translateY(-2px);
        color: #ffffff !important;
        border-color: #ff5500;
        box-shadow: 0 4px 14px rgba(255, 85, 0, 0.35);
      }
      .btn-action-ghost-mini:hover::before {
        transform: scaleX(1);
        transform-origin: left;
      }

      .btn-logout-side {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        background: rgba(220, 38, 38, 0.08);
        border: 1px solid rgba(220, 38, 38, 0.3);
        color: #f87171 !important;
        padding: 9px 14px;
        font-size: 12px;
        font-weight: 700;
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
        isolation: isolate;
        transition: color 240ms ease, transform 240ms cubic-bezier(0.16, 1, 0.3, 1), border-color 240ms ease, box-shadow 240ms ease;
      }
      .btn-logout-side::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background: #dc2626;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .btn-logout-side > * {
        position: relative;
        z-index: 2;
      }
      .btn-logout-side:hover {
        transform: translateY(-2px);
        color: #ffffff !important;
        border-color: #ef4444;
        box-shadow: 0 4px 14px rgba(239, 68, 68, 0.45);
      }
      .btn-logout-side:hover::before {
        transform: scaleX(1);
        transform-origin: left;
      }

      /* Buttons — Curtain Swipe Fill Suite */
      .btn-primary {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: #ff5500;
        border: 1px solid #ff5500;
        color: #ffffff !important;
        padding: 8px 18px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
        isolation: isolate;
        transition: color 260ms ease, transform 260ms cubic-bezier(0.16, 1, 0.3, 1), border-color 260ms ease, box-shadow 260ms ease;
      }
      .btn-primary::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background: #000000;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 320ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .btn-primary > * {
        position: relative;
        z-index: 2;
      }
      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        color: #ffffff !important;
        border-color: #ff7733;
        box-shadow: 0 4px 18px rgba(255, 85, 0, 0.45);
      }
      .btn-primary:hover:not(:disabled)::before {
        transform: scaleX(1);
        transform-origin: left;
      }
      .btn-primary:active:not(:disabled) {
        transform: translateY(0);
      }
      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-secondary {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.18);
        color: #ffffff !important;
        padding: 8px 16px;
        font-size: 12px;
        font-weight: 700;
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
        isolation: isolate;
        transition: color 260ms ease, transform 260ms cubic-bezier(0.16, 1, 0.3, 1), border-color 260ms ease, box-shadow 260ms ease;
      }
      .btn-secondary::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background: #ffffff;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 320ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .btn-secondary > * {
        position: relative;
        z-index: 2;
      }
      .btn-secondary:hover:not(:disabled) {
        transform: translateY(-2px);
        color: #000000 !important;
        border-color: #ffffff;
        box-shadow: 0 4px 16px rgba(255, 255, 255, 0.2);
      }
      .btn-secondary:hover:not(:disabled)::before {
        transform: scaleX(1);
        transform-origin: left;
      }
      .btn-secondary:active:not(:disabled) {
        transform: translateY(0);
      }

      .btn-action-ghost {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.05);
        border: 1.5px solid rgba(255, 255, 255, 0.22);
        color: #f4f4f5 !important;
        padding: 8px 14px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.3px;
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
        isolation: isolate;
        transition: color 260ms ease, transform 260ms cubic-bezier(0.16, 1, 0.3, 1), border-color 260ms ease, box-shadow 260ms ease;
        text-decoration: none;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        white-space: nowrap;
      }
      .btn-action-ghost::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background: #ffffff;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 320ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .btn-action-ghost > * {
        position: relative;
        z-index: 2;
      }
      .btn-action-ghost:hover:not(:disabled) {
        transform: translateY(-2px);
        color: #000000 !important;
        border-color: #ffffff;
        box-shadow: 0 4px 16px rgba(255, 255, 255, 0.25);
      }
      .btn-action-ghost:hover:not(:disabled)::before {
        transform: scaleX(1);
        transform-origin: left;
      }
      .btn-action-ghost:active:not(:disabled) {
        transform: translateY(0);
      }
      .btn-action-ghost:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* KPI Cards */
      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-bottom: 28px;
      }
      .kpi-card {
        background: rgba(255, 255, 255, 0.025);
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 20px;
        border-radius: 10px;
        backdrop-filter: blur(10px);
      }
      .kpi-card.highlight {
        border-color: rgba(189, 74, 44, 0.4);
        background: linear-gradient(135deg, rgba(189, 74, 44, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
      }
      .kpi-card.alert {
        border-color: rgba(234, 179, 8, 0.3);
      }
      .kpi-label {
        color: #8e8e93;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .kpi-value {
        font-family: var(--font-display, Georgia, serif);
        font-size: 24px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 4px;
      }
      .kpi-currency {
        font-size: 13px;
        color: #8e8e93;
        font-family: inherit;
      }
      .kpi-sub {
        color: #636366;
        font-size: 12px;
      }

      .tab-pill {
        background: rgba(255, 255, 255, 0.1);
        padding: 2px 7px;
        border-radius: 12px;
        font-size: 10px;
      }
      .tab-pill.alert {
        background: #ef4444;
        color: #fff;
      }

      /* Responsive Layout */
      @media (max-width: 960px) {
        .admin-app-layout {
          flex-direction: column;
        }
        .admin-sidebar {
          width: 100%;
          height: auto;
          position: static;
          border-right: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .admin-sidebar-nav {
          flex-direction: row;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .admin-nav-btn {
          white-space: nowrap;
          border-left: none;
          border-bottom: 2px solid transparent;
        }
        .admin-nav-btn.active {
          border-left: none;
          border-bottom: 2px solid #ff5500;
        }
        .admin-main-area {
          padding: 20px 16px;
        }
      }

      /* Toolbar */
      .pane-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }
      .search-box {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 8px 14px;
        border-radius: 6px;
        flex: 1;
        max-width: 420px;
        color: #8e8e93;
      }
      .search-box input {
        background: transparent;
        border: none;
        color: #ffffff;
        font-size: 13px;
        width: 100%;
        outline: none;
      }
      .filter-group {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }
      .filter-group select {
        background: #151419;
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #e5e5ea;
        padding: 8px 12px;
        font-size: 12px;
        border-radius: 6px;
        outline: none;
      }

      /* Tables */
      .table-responsive {
        overflow-x: auto;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
      }
      .admin-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        text-align: left;
      }
      .admin-table th {
        background: rgba(255, 255, 255, 0.04);
        color: #8e8e93;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 14px 18px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .admin-table td {
        padding: 16px 18px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        vertical-align: middle;
      }
      .admin-table tr:hover td {
        background: rgba(255, 255, 255, 0.02);
      }

      .order-code { color: #fff; font-size: 14px; }
      .order-ref { font-size: 11px; color: #8e8e93; font-family: monospace; }
      .cell-date { color: #e5e5ea; font-weight: 500; }
      .cell-time { color: #8e8e93; font-size: 11px; }
      .cell-name { font-weight: 600; color: #fff; }
      .cell-email { font-size: 11px; color: #8e8e93; }
      .cell-city { font-weight: 500; color: #e5e5ea; }
      .cell-address { font-size: 11px; color: #8e8e93; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .cell-price { color: #fff; }
      .cell-items-count { font-size: 11px; color: #8e8e93; }

      /* Badges */
      .status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .payment-approved { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
      .payment-pending { background: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.3); }
      .payment-declined, .payment-error { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }

      .delivery-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 7px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .del-creado { background: rgba(148, 163, 184, 0.15); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.3); }
      .del-en_preparacion { background: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.3); }
      .del-despachado { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
      .del-entregado { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
      .del-devuelto { background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }

      .select-delivery {
        background: #18171d;
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #fff;
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        outline: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .select-delivery.delivery-devuelto {
        background: rgba(239, 68, 68, 0.15);
        border-color: #ef4444;
        color: #fca5a5;
      }
      .btn-detail {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.16);
        color: #e5e5ea !important;
        padding: 6px 14px;
        font-size: 11px;
        font-weight: 700;
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
        isolation: isolate;
        transition: color 240ms ease, transform 240ms cubic-bezier(0.16, 1, 0.3, 1), border-color 240ms ease, box-shadow 240ms ease;
      }
      .btn-detail::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background: #ffffff;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .btn-detail > * {
        position: relative;
        z-index: 2;
      }
      .btn-detail:hover {
        transform: translateY(-2px);
        color: #000000 !important;
        border-color: #ffffff;
        box-shadow: 0 4px 14px rgba(255, 255, 255, 0.2);
      }
      .btn-detail:hover::before {
        transform: scaleX(1);
        transform-origin: left;
      }

      .btn-action-view {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background: rgba(255, 85, 0, 0.12);
        border: 1px solid rgba(255, 85, 0, 0.35);
        color: #ff7733 !important;
        padding: 6px 12px;
        font-size: 11px;
        font-weight: 700;
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
        isolation: isolate;
        transition: color 240ms ease, transform 240ms cubic-bezier(0.16, 1, 0.3, 1), border-color 240ms ease, box-shadow 240ms ease;
        white-space: nowrap;
      }
      .btn-action-view::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background: #ff5500;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .btn-action-view > * {
        position: relative;
        z-index: 2;
      }
      .btn-action-view:hover {
        transform: translateY(-2px);
        color: #ffffff !important;
        border-color: #ff5500;
        box-shadow: 0 4px 14px rgba(255, 85, 0, 0.45);
      }
      .btn-action-view:hover::before {
        transform: scaleX(1);
        transform-origin: left;
      }

      .btn-action-delete-demo {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.35);
        color: #f87171 !important;
        padding: 6px 10px;
        font-size: 11px;
        font-weight: 700;
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
        isolation: isolate;
        transition: color 240ms ease, transform 240ms cubic-bezier(0.16, 1, 0.3, 1), border-color 240ms ease, box-shadow 240ms ease;
        white-space: nowrap;
      }
      .btn-action-delete-demo::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background: #dc2626;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .btn-action-delete-demo > * {
        position: relative;
        z-index: 2;
      }
      .btn-action-delete-demo:hover:not(:disabled) {
        transform: translateY(-2px);
        color: #ffffff !important;
        border-color: #ef4444;
        box-shadow: 0 4px 14px rgba(239, 68, 68, 0.45);
      }
      .btn-action-delete-demo:hover:not(:disabled)::before {
        transform: scaleX(1);
        transform-origin: left;
      }
      .btn-action-delete-demo:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Product Cards in Admin */
      .products-grid-admin {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }
      .product-admin-card {
        background: rgba(255, 255, 255, 0.025);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .product-admin-img-wrap {
        height: 220px;
        background: #000;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .product-admin-img-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .product-admin-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background: #bd4a2c;
        color: #fff;
        font-size: 9px;
        font-weight: 800;
        padding: 3px 6px;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
      .stock-tag {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(4px);
        color: #a1a1aa;
        font-size: 11px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .stock-tag.critical {
        background: rgba(220, 38, 38, 0.85);
        color: #fff;
      }
      .product-admin-body {
        padding: 16px;
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      .product-admin-category {
        color: #bd4a2c;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 4px;
      }
      .product-admin-title {
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 4px;
        color: #fff;
      }
      .product-admin-subtitle {
        font-size: 12px;
        color: #8e8e93;
        margin: 0 0 12px;
        line-height: 1.3;
      }
      .product-admin-price {
        font-size: 18px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 12px;
      }
      .product-admin-variants {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }
      .variant-pill {
        background: rgba(255, 255, 255, 0.05);
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 4px;
        color: #a1a1aa;
      }
      .product-admin-actions {
        display: flex;
        gap: 8px;
        margin-top: auto;
      }
      .btn-card-action {
        position: relative;
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        overflow: hidden;
        isolation: isolate;
        border: 1px solid transparent;
        transition: color 240ms ease, transform 240ms cubic-bezier(0.16, 1, 0.3, 1), border-color 240ms ease, box-shadow 240ms ease;
      }
      .btn-card-action::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .btn-card-action > * {
        position: relative;
        z-index: 2;
      }
      .btn-card-action.edit {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.15);
        color: #fff !important;
      }
      .btn-card-action.edit::before {
        background: #ff5500;
      }
      .btn-card-action.edit:hover {
        transform: translateY(-2px);
        border-color: #ff5500;
        color: #ffffff !important;
        box-shadow: 0 4px 14px rgba(255, 85, 0, 0.4);
      }
      .btn-card-action.edit:hover::before {
        transform: scaleX(1);
        transform-origin: left;
      }

      .btn-card-action.delete {
        flex: 0 0 36px;
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.25);
        color: #f87171 !important;
      }
      .btn-card-action.delete::before {
        background: #dc2626;
      }
      .btn-card-action.delete:hover {
        transform: translateY(-2px);
        border-color: #ef4444;
        color: #ffffff !important;
        box-shadow: 0 4px 14px rgba(239, 68, 68, 0.45);
      }
      .btn-card-action.delete:hover::before {
        transform: scaleX(1);
        transform-origin: left;
      }

      /* Inventory Table */
      .inventory-product-cell {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .mini-thumb {
        width: 42px;
        height: 42px;
        border-radius: 4px;
        object-fit: cover;
        background: #000;
      }
      .mini-sub { font-size: 11px; color: #8e8e93; }
      .stock-level-wrap { width: 140px; }
      .stock-bar-bg {
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        margin-top: 4px;
        overflow: hidden;
      }
      .stock-bar-fill.ok { background: #22c55e; }
      .stock-bar-fill.warning { background: #eab308; }
      .stock-bar-fill.critical { background: #ef4444; }
      .stock-status-pill {
        display: inline-block;
        font-size: 11px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 4px;
        text-transform: uppercase;
      }
      .stock-status-pill.ok { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
      .stock-status-pill.low { background: rgba(234, 179, 8, 0.15); color: #facc15; }
      .stock-status-pill.out { background: rgba(239, 68, 68, 0.15); color: #f87171; }
      .stock-quick-btns {
        display: flex;
        gap: 4px;
      }
      .btn-qty {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn-qty.highlight {
        background: rgba(189, 74, 44, 0.2);
        border-color: rgba(189, 74, 44, 0.4);
        color: #f97316;
      }

      /* Analytics */
      .analytics-hero-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
        gap: 20px;
        margin-bottom: 24px;
      }
      .hero-kpi-card {
        background: rgba(255, 255, 255, 0.025);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 22px;
        transition: transform 0.2s ease, border-color 0.2s ease;
      }
      .hero-kpi-card:hover {
        transform: translateY(-2px);
      }
      .hero-kpi-card.sales {
        border-color: rgba(249, 115, 22, 0.35);
        background: linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(15, 14, 18, 0.9) 100%);
      }
      .hero-kpi-card.views {
        border-color: rgba(56, 189, 248, 0.35);
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(15, 14, 18, 0.9) 100%);
      }
      .hero-kpi-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.5px;
        padding: 4px 10px;
        border-radius: 6px;
        margin-bottom: 16px;
      }
      .hero-kpi-badge.sales {
        background: rgba(249, 115, 22, 0.2);
        color: #fb923c;
        border: 1px solid rgba(249, 115, 22, 0.4);
      }
      .hero-kpi-badge.views {
        background: rgba(56, 189, 248, 0.2);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.4);
      }
      .hero-kpi-content {
        display: flex;
        gap: 16px;
        align-items: flex-start;
      }
      .hero-kpi-img-wrap {
        width: 90px;
        height: 115px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;
        background: #000;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .hero-kpi-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .hero-kpi-img-fallback {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #52525b;
      }
      .hero-kpi-details {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .hero-kpi-cat {
        font-size: 10px;
        text-transform: uppercase;
        color: #a1a1aa;
        letter-spacing: 0.5px;
        font-weight: 700;
      }
      .hero-kpi-title {
        font-size: 16px;
        font-weight: 800;
        color: #fff;
        margin: 3px 0 10px;
        font-family: var(--font-display, Georgia, serif);
      }
      .hero-kpi-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        background: rgba(0, 0, 0, 0.35);
        padding: 10px;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        margin-bottom: 12px;
      }
      .hero-stat-block {
        display: flex;
        flex-direction: column;
      }
      .stat-label {
        font-size: 8.5px;
        text-transform: uppercase;
        color: #8e8e93;
        letter-spacing: 0.3px;
      }
      .stat-val {
        font-size: 13px;
        font-weight: 800;
        color: #fff;
        margin-top: 2px;
      }
      .stat-val.sales { color: #fb923c; }
      .stat-val.views { color: #38bdf8; }
      .hero-kpi-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .hero-action-link {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        font-weight: 700;
        padding: 6px 12px;
        border-radius: 4px;
        background: #bd4a2c;
        color: #fff;
        text-decoration: none;
        transition: opacity 0.2s;
      }
      .hero-action-link:hover { opacity: 0.9; }
      .hero-action-link.views { background: #0284c7; }
      .hero-action-btn {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        font-weight: 600;
        padding: 6px 10px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #d4d4d8;
        cursor: pointer;
        transition: background 0.2s;
      }
      .hero-action-btn:hover { background: rgba(255, 255, 255, 0.12); color: #fff; }
      .empty-hero {
        padding: 24px;
        text-align: center;
        color: #71717a;
        font-size: 13px;
      }

      /* Analytics Sub-Navigation */
      .analytics-subnav-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 24px;
      }
      .subnav-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 700;
        color: #e4e4e7;
      }
      .subnav-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .btn-subnav {
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #a1a1aa;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-subnav:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
      }
      .btn-subnav.active {
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.3);
      }
      .btn-subnav.sales.active {
        background: rgba(249, 115, 22, 0.2);
        color: #fb923c;
        border-color: rgba(249, 115, 22, 0.4);
      }
      .btn-subnav.views.active {
        background: rgba(56, 189, 248, 0.2);
        color: #38bdf8;
        border-color: rgba(56, 189, 248, 0.4);
      }

      /* Analytics Grid Flexible */
      .analytics-grid-flexible {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .analytics-box {
        background: rgba(255, 255, 255, 0.025);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 24px;
      }
      .analytics-box.large {
        width: 100%;
      }
      .analytics-box.side-box {
        width: 100%;
      }
      .analytics-box h3 { margin: 0 0 4px; font-size: 18px; color: #fff; }
      .box-sub { color: #8e8e93; font-size: 12px; margin: 0 0 20px; }
      .box-header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 12px;
      }
      .box-tag {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 10px;
        font-weight: 800;
        padding: 3px 8px;
        border-radius: 4px;
        margin-bottom: 6px;
        letter-spacing: 0.5px;
      }
      .box-tag.sales {
        background: rgba(249, 115, 22, 0.15);
        color: #fb923c;
        border: 1px solid rgba(249, 115, 22, 0.3);
      }
      .box-tag.views {
        background: rgba(56, 189, 248, 0.15);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.3);
      }
      .box-tag.neutral {
        background: rgba(255, 255, 255, 0.08);
        color: #a1a1aa;
      }
      .box-header-stat {
        background: rgba(249, 115, 22, 0.1);
        border: 1px solid rgba(249, 115, 22, 0.25);
        padding: 8px 14px;
        border-radius: 6px;
        text-align: right;
      }
      .box-header-stat.views {
        background: rgba(56, 189, 248, 0.1);
        border: 1px solid rgba(56, 189, 248, 0.25);
      }
      .box-header-stat .stat-sub {
        display: block;
        font-size: 9px;
        text-transform: uppercase;
        color: #8e8e93;
      }
      .box-header-stat strong {
        font-size: 15px;
        color: #fff;
      }
      .section-subtitle {
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #e4e4e7;
        margin: 18px 0 12px;
        border-left: 3px solid #bd4a2c;
        padding-left: 8px;
      }

      /* Bars */
      .category-bars { display: flex; flex-direction: column; gap: 14px; }
      .bar-info { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }
      .bar-label { font-weight: 600; color: #fff; }
      .bar-values { display: flex; align-items: center; gap: 10px; font-size: 12px; }
      .bar-revenue { color: #a1a1aa; font-family: monospace; font-size: 11px; }
      .bar-units.sales { color: #fb923c; font-weight: 800; }
      .bar-units.views { color: #38bdf8; font-weight: 800; }
      .bar-track { height: 8px; background: rgba(255, 255, 255, 0.08); border-radius: 4px; overflow: hidden; }
      .bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
      .bar-fill.sales { background: linear-gradient(90deg, #bd4a2c 0%, #f97316 100%); }
      .bar-fill.views { background: linear-gradient(90deg, #0284c7 0%, #38bdf8 100%); }

      /* Tables in Analytics */
      .analytics-table-wrap {
        overflow-x: auto;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.25);
      }
      .analytics-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
        font-size: 12px;
      }
      .analytics-table th {
        padding: 10px 12px;
        background: rgba(255, 255, 255, 0.03);
        color: #8e8e93;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 700;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .analytics-table td {
        padding: 10px 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        vertical-align: middle;
      }
      .analytics-table tr:last-child td { border-bottom: none; }
      .highlight-row.sales { background: rgba(249, 115, 22, 0.06); }
      .highlight-row.views { background: rgba(56, 189, 248, 0.06); }
      .cell-rank { font-weight: 700; color: #8e8e93; }
      .rank-badge {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 800;
      }
      .rank-badge.top-sales { background: #bd4a2c; color: #fff; }
      .rank-badge.top-views { background: #0284c7; color: #fff; }
      .table-prod-info { display: flex; align-items: center; gap: 10px; }
      .table-prod-img {
        width: 36px;
        height: 36px;
        border-radius: 4px;
        object-fit: cover;
        background: #000;
        flex-shrink: 0;
      }
      .table-prod-fallback {
        width: 36px;
        height: 36px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #52525b;
      }
      .table-prod-name { display: block; color: #fff; font-size: 12px; }
      .table-prod-id { display: block; color: #71717a; font-size: 10px; font-family: monospace; }
      .table-cat-pill {
        display: inline-block;
        padding: 2px 7px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        font-size: 11px;
        color: #d4d4d8;
      }
      .uds-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 800;
        font-size: 11px;
      }
      .uds-badge.active {
        background: rgba(249, 115, 22, 0.15);
        color: #fb923c;
        border: 1px solid rgba(249, 115, 22, 0.3);
      }
      .uds-badge.zero {
        background: rgba(255, 255, 255, 0.03);
        color: #71717a;
      }
      .revenue-val {
        color: #4ade80;
        font-size: 12px;
        font-family: monospace;
      }
      .revenue-val .curr { color: #8e8e93; font-size: 9px; font-family: sans-serif; }
      .stock-badge {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 700;
      }
      .stock-badge.critical { background: rgba(239, 68, 68, 0.15); color: #f87171; }
      .stock-badge.normal { background: rgba(255, 255, 255, 0.05); color: #a1a1aa; }
      .views-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 4px;
        background: rgba(56, 189, 248, 0.12);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.25);
        font-weight: 700;
        font-size: 11px;
      }
      .conversion-wrap { display: flex; flex-direction: column; }
      .conv-pct { color: #fff; font-size: 12px; font-weight: 700; }
      .conv-sub { color: #8e8e93; font-size: 10px; }
      .interest-pill {
        display: inline-flex;
        align-items: center;
        font-size: 11px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 4px;
      }
      .interest-pill.high {
        background: rgba(249, 115, 22, 0.15);
        color: #fb923c;
        border: 1px solid rgba(249, 115, 22, 0.3);
      }
      .interest-pill.medium {
        background: rgba(234, 179, 8, 0.15);
        color: #facc15;
        border: 1px solid rgba(234, 179, 8, 0.3);
      }
      .interest-pill.normal {
        background: rgba(56, 189, 248, 0.12);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.25);
      }
      .table-link-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        font-size: 11px;
        font-weight: 600;
        text-decoration: none;
        transition: background 0.2s;
      }
      .table-link-btn:hover { background: rgba(255, 255, 255, 0.15); }

      .funnel-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
      .funnel-item { background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 6px; text-align: center; }
      .funnel-label { font-size: 10px; text-transform: uppercase; color: #8e8e93; margin-bottom: 4px; }
      .funnel-val { font-size: 20px; font-weight: 700; color: #fff; }
      .funnel-item.success .funnel-val { color: #4ade80; }
      .funnel-item.pending .funnel-val { color: #facc15; }

      .rate-circle-wrap {
        text-align: center;
        padding: 20px;
        border-radius: 8px;
        background: rgba(189, 74, 44, 0.08);
        border: 1px solid rgba(189, 74, 44, 0.2);
      }
      .rate-num { font-size: 38px; font-weight: 800; color: #fff; font-family: var(--font-display, Georgia, serif); }
      .rate-text { font-size: 12px; color: #8e8e93; margin-top: 4px; }
      .wompi-summary-box {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-size: 12px;
      }
      .wompi-stat-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #a1a1aa;
      }
      .wompi-stat-line strong {
        color: #fff;
        font-size: 13px;
      }

      /* Settings Split */
      .settings-split {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 24px;
      }
      .settings-section {
        background: rgba(255, 255, 255, 0.025);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 24px;
      }
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        gap: 16px;
      }
      .section-header h3 { margin: 0 0 4px; font-size: 18px; color: #fff; }
      .section-header p { margin: 0; font-size: 12px; color: #8e8e93; }

      .coupons-list { display: flex; flex-direction: column; gap: 10px; }
      .coupon-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 12px 16px;
        border-radius: 6px;
      }
      .coupon-left { display: flex; align-items: center; gap: 12px; }
      .coupon-icon { color: #bd4a2c; }
      .coupon-code { font-size: 14px; font-family: monospace; color: #fff; }
      .coupon-desc { font-size: 11px; color: #8e8e93; }
      .coupon-right { display: flex; align-items: center; gap: 10px; }
      .status-pill { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
      .status-pill.active { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
      .status-pill.inactive { background: rgba(255, 255, 255, 0.1); color: #8e8e93; }
      .btn-icon-danger { background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 4px; }

      /* Settings Form */
      .settings-form { display: flex; flex-direction: column; gap: 14px; }
      .form-group { display: flex; flex-direction: column; gap: 6px; flex: 1; }
      .form-group label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8e8e93; }
      .form-group input, .form-group textarea, .form-group select {
        background: #151419;
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #fff;
        padding: 10px 14px;
        font-size: 13px;
        border-radius: 6px;
        outline: none;
      }
      .form-row { display: flex; gap: 12px; }

      /* Modals */
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        z-index: 1000;
      }
      .modal-card {
        background: #111015;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        width: min(720px, 100%);
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      }
      .modal-header {
        padding: 20px 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .modal-eyebrow { font-size: 10px; color: #bd4a2c; font-weight: 800; letter-spacing: 1.5px; }
      .modal-header h2 { margin: 2px 0 0; font-size: 20px; color: #fff; }
      .btn-close {
        width: 36px;
        height: 36px;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.65);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #ffffff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
        flex-shrink: 0;
      }
      .btn-close:hover {
        transform: rotate(90deg) scale(1.08);
        background-color: #ff5500 !important;
        border-color: #ff5500 !important;
        color: #ffffff !important;
        box-shadow: 0 0 16px rgba(255, 85, 0, 0.55);
      }
      .btn-close:active {
        transform: rotate(90deg) scale(0.96);
      }
      .modal-body { padding: 24px; }
      .modal-footer {
        padding: 16px 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }

      /* Order Modal Grid */
      .order-summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
        background: rgba(255, 255, 255, 0.02);
        padding: 16px;
        border-radius: 8px;
      }
      .info-block label { display: block; font-size: 10px; text-transform: uppercase; color: #8e8e93; font-weight: 700; margin-bottom: 4px; }
      .input-tracking {
        background: #18171d;
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #fff;
        font-size: 12px;
        padding: 6px 10px;
        border-radius: 4px;
        width: 100%;
        outline: none;
      }
      .modal-items-section h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #8e8e93; margin: 0 0 12px; }
      .items-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
      .item-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
      }
      .item-row img { width: 44px; height: 44px; border-radius: 4px; object-fit: cover; }
      .item-info { flex: 1; }
      .item-specs { font-size: 11px; color: #8e8e93; }
      .item-price { font-weight: 700; color: #fff; font-size: 13px; }
      .order-total-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 16px;
        background: rgba(189, 74, 44, 0.1);
        border: 1px solid rgba(189, 74, 44, 0.3);
        border-radius: 6px;
        font-size: 16px;
        color: #fff;
      }

      /* Empty State */
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px dashed rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }
      .empty-icon { color: #8e8e93; margin-bottom: 12px; }
      .empty-state h3 { margin: 0 0 6px; color: #fff; }
      .empty-state p { margin: 0; color: #8e8e93; font-size: 13px; }

      /* Toast */
      .toast-notification {
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 2000;
        animation: slideUp 0.3s ease-out;
      }
      .toast-notification.success { background: #166534; color: #bbf7d0; border: 1px solid #22c55e; }
      .toast-notification.error { background: #991b1b; color: #fecaca; border: 1px solid #ef4444; }

      /* DB Inspector Styles */
      .db-server-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 24px;
        gap: 20px;
        flex-wrap: wrap;
      }
      .db-server-left {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .db-status-icon-wrap {
        position: relative;
        width: 52px;
        height: 52px;
        border-radius: 10px;
        background: rgba(34, 197, 94, 0.15);
        border: 1px solid rgba(34, 197, 94, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4ade80;
      }
      .live-ping-dot {
        position: absolute;
        top: -3px;
        right: -3px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 8px #22c55e;
      }
      .db-tag-row {
        display: flex;
        gap: 6px;
        margin-bottom: 4px;
      }
      .badge-live-db {
        background: rgba(34, 197, 94, 0.2);
        color: #4ade80;
        font-size: 10px;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 4px;
        letter-spacing: 1px;
      }
      .badge-env-db {
        background: rgba(255, 255, 255, 0.08);
        color: #e5e5ea;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .db-server-title {
        font-size: 20px;
        font-weight: 700;
        margin: 0 0 4px;
        color: #fff;
      }
      .db-sub-meta {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: #8e8e93;
      }
      .db-sub-meta code {
        color: #fff;
        background: rgba(255, 255, 255, 0.06);
        padding: 2px 6px;
        border-radius: 4px;
      }

      /* DB Tables Grid */
      .db-tables-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
        margin-bottom: 28px;
      }
      .db-table-card {
        background: rgba(255, 255, 255, 0.025);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 18px;
        cursor: pointer;
        transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .db-table-card:hover {
        background: rgba(166, 136, 103, 0.06);
        border-color: rgba(166, 136, 103, 0.45);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
      }
      .db-table-card.selected {
        background: linear-gradient(135deg, rgba(166, 136, 103, 0.16) 0%, rgba(255, 255, 255, 0.03) 100%);
        border-color: #a68867;
        box-shadow: 0 0 25px rgba(166, 136, 103, 0.25);
        transform: translateY(-2px);
      }
      .table-card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .table-icon { 
        color: #a68867; 
        filter: drop-shadow(0 0 8px rgba(166, 136, 103, 0.4));
        transition: transform 0.2s ease, filter 0.2s ease;
      }
      .db-table-card:hover .table-icon,
      .db-table-card.selected .table-icon {
        transform: scale(1.1);
        filter: drop-shadow(0 0 12px rgba(166, 136, 103, 0.7));
      }
      .table-row-count {
        font-size: 11px;
        font-weight: 800;
        color: #d4c3b3;
        background: rgba(166, 136, 103, 0.14);
        border: 1px solid rgba(166, 136, 103, 0.3);
        padding: 2px 8px;
        border-radius: 4px;
        letter-spacing: 0.02em;
      }
      .table-name-code {
        font-family: monospace;
        font-size: 15px;
        color: #fff;
        display: block;
        margin-bottom: 2px;
      }
      .table-label-text {
        font-size: 12px;
        font-weight: 600;
        color: #e5e5ea;
        margin-bottom: 4px;
      }
      .table-desc-text {
        font-size: 11px;
        color: #8e8e93;
        line-height: 1.3;
      }

      /* DB Data Viewer */
      .db-data-viewer {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 32px;
      }
      .viewer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 12px;
      }
      .viewer-eyebrow {
        font-size: 10px;
        font-weight: 800;
        color: #bd4a2c;
        letter-spacing: 1.5px;
      }
      .viewer-header h3 {
        margin: 2px 0 0;
        font-size: 16px;
        color: #fff;
      }
      .viewer-header code {
        color: #4ade80;
      }
      .viewer-query-pill {
        background: #000;
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 11px;
        color: #a1a1aa;
      }
      .db-loading-box {
        text-align: center;
        padding: 40px;
        color: #8e8e93;
      }
      .db-loading-box p { margin-top: 10px; font-size: 13px; }
      .db-sql-table th { font-family: monospace; font-size: 11px; }
      .sql-cell {
        font-family: monospace;
        font-size: 11px;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .json-cell {
        color: #93c5fd;
        cursor: help;
      }

      .role-badge {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
      .role-superadmin {
        background: rgba(234, 179, 8, 0.2);
        color: #facc15;
        border: 1px solid rgba(234, 179, 8, 0.4);
      }
      .role-admin {
        background: rgba(189, 74, 44, 0.2);
        color: #f97316;
        border: 1px solid rgba(189, 74, 44, 0.4);
      }
      .role-cliente {
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
        border: 1px solid rgba(59, 130, 246, 0.3);
      }

      /* Explainer Section */
      .db-value-explainer {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 24px;
      }
      .db-value-explainer h3 {
        margin: 0 0 16px;
        font-size: 18px;
        color: #fff;
      }
      .explainer-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
      }
      .explainer-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        padding: 16px;
        border-radius: 8px;
      }
      .explainer-num {
        color: #a68867;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 2px;
        margin-bottom: 6px;
      }
      .explainer-card h4 {
        margin: 0 0 6px;
        font-size: 14px;
        color: #fff;
      }
      .explainer-card p {
        margin: 0;
        font-size: 12px;
        color: #8e8e93;
        line-height: 1.4;
      }

      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .spin { animation: spin 1s linear infinite; }
      @keyframes spin { 100% { transform: rotate(360deg); } }

      /* ======================================================== */
      /* NOCTIS ADMIN: RESPONSIVE & MOBILE-FIRST ARCHITECTURE     */
      /* ======================================================== */
      
      /* Mobile Topbar (Hidden on Desktop) */
      .admin-mobile-topbar {
        display: none;
        position: sticky;
        top: 0;
        z-index: 110;
        background: #060608;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 12px 16px;
        align-items: center;
        justify-content: space-between;
      }
      .admin-mobile-topbar-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .admin-mobile-menu-btn {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #ffffff;
        width: 38px;
        height: 38px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.1s ease;
      }
      .admin-mobile-menu-btn:active {
        transform: scale(0.94);
      }
      .admin-mobile-badge {
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 1.5px;
        color: #ff5500;
      }
      .admin-mobile-title {
        font-family: var(--font-display, Georgia, serif);
        font-size: 1.05rem;
        font-weight: 900;
        color: #ffffff;
        letter-spacing: 0.04em;
        line-height: 1.1;
      }
      .admin-mobile-topbar-right {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .admin-mobile-store-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 85, 0, 0.12);
        border: 1px solid rgba(255, 85, 0, 0.35);
        color: #ff7733 !important;
        padding: 0 12px;
        height: 38px;
        border-radius: 8px;
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.03em;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .admin-mobile-store-btn:hover {
        background: rgba(255, 85, 0, 0.22);
        border-color: #ff5500;
        color: #ffffff !important;
      }
      .admin-mobile-store-btn:active {
        transform: scale(0.96);
      }
      .admin-mobile-refresh-btn {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #e4e4e7;
        width: 38px;
        height: 38px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .admin-mobile-refresh-btn:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
      }
      .admin-mobile-refresh-btn:active {
        transform: scale(0.96);
      }

      /* Mobile Bento Hub Container & Mobile Bars (Hidden on Desktop) */
      .admin-mobile-hub-container {
        display: none;
      }
      .admin-mobile-back-bar {
        display: none;
      }
      .admin-orders-mobile-list {
        display: none;
      }
      .admin-settings-mobile-sub-back {
        display: none !important;
      }

      /* Desktop Settings Layout (Grid 2 Columnas) */
      .admin-settings-layout {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 24px;
        align-items: start;
      }
      .admin-settings-subnav {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background-color: #141418;
        padding: 12px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .admin-settings-panel {
        display: block;
        width: 100%;
        min-width: 0;
      }
      .admin-settings-preview-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        width: 100%;
      }
      .admin-settings-cards-2col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        width: 100%;
      }

      /* MEDIA QUERIES FOR <= 900px */
      @media (max-width: 900px) {
        .admin-mobile-topbar {
          display: flex;
        }

        /* Bento Hub Screen */
        .admin-mobile-hub-container.is-active {
          display: block;
          padding: 20px 16px 80px 16px;
          min-height: calc(100vh - 60px);
          background: #08080a;
        }
        .admin-mobile-hub-container.is-hidden {
          display: none !important;
        }

        .admin-hub-user-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 8px 4px 16px 4px;
        }
        .admin-hub-user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #18181b;
          border: 2px solid #ff5500;
          color: #ff7733;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.3rem;
          box-shadow: 0 0 16px rgba(255, 85, 0, 0.3);
          flex-shrink: 0;
        }
        .admin-hub-user-info {
          overflow: hidden;
          flex: 1;
        }
        .admin-hub-user-name {
          font-size: 1.05rem;
          font-weight: 900;
          margin: 0;
          color: #ffffff;
        }
        .admin-hub-badge-verified {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(34, 197, 94, 0.18);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.35);
          font-size: 0.62rem;
          font-weight: 900;
          padding: 2px 7px;
          border-radius: 12px;
          letter-spacing: 0.04em;
        }
        .admin-hub-user-email {
          font-size: 0.74rem;
          color: #a1a1aa;
          margin: 3px 0 0;
        }
        .admin-hub-divider {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 12px 0 18px;
        }
        .admin-hub-section-title {
          font-size: 0.74rem;
          font-weight: 900;
          color: #a1a1aa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 14px;
        }

        /* 2-Column Bento Cards Grid */
        .admin-mobile-bento-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .admin-bento-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          min-height: 126px;
          padding: 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          text-align: left;
          box-sizing: border-box;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .admin-bento-card:hover,
        .admin-bento-card.active {
          border-color: #ff5500;
          background: rgba(255, 85, 0, 0.08);
          box-shadow: 0 0 16px rgba(255, 85, 0, 0.18);
        }
        .admin-bento-card:active {
          transform: scale(0.96);
        }
        .admin-bento-card strong {
          font-size: 0.92rem;
          font-weight: 800;
          color: #ffffff;
          margin-top: 8px;
          margin-bottom: 2px;
        }
        .admin-bento-card span {
          font-size: 0.72rem;
          color: #71717a;
          line-height: 1.2;
        }
        .bento-badge {
          margin-top: 8px;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 10px;
          background: rgba(255, 85, 0, 0.16);
          color: #ff7733;
          border: 1px solid rgba(255, 85, 0, 0.3);
        }
        .bento-badge.alert {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.4);
        }
        .bento-badge.ok {
          background: rgba(34, 197, 94, 0.18);
          color: #4ade80;
          border-color: rgba(34, 197, 94, 0.35);
        }
        .bento-badge.db-badge {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          border-color: rgba(34, 197, 94, 0.4);
        }
        .logout-bento-card {
          border-color: rgba(239, 68, 68, 0.25);
          background: rgba(239, 68, 68, 0.04);
        }
        .logout-bento-card:hover {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        /* Detail Mode Behavior in App Layout */
        .admin-app-layout.mobile-hub-active {
          display: none !important;
        }
        .admin-app-layout.mobile-detail-active {
          display: flex !important;
          flex-direction: column;
        }

        /* Back to Hub Bar */
        .admin-mobile-back-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .admin-mobile-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
        }
        .admin-mobile-back-btn:active {
          transform: scale(0.96);
        }
        .admin-active-tab-title {
          font-size: 0.82rem;
          font-weight: 800;
          color: #ff5500;
        }

        /* Hide Desktop Table and Show Mobile Cards */
        .admin-desktop-table {
          display: none !important;
        }
        .admin-orders-mobile-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .admin-order-mobile-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }
        .admin-order-mobile-card .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .admin-order-mobile-card .order-card-date {
          font-size: 0.68rem;
          color: #a1a1aa;
        }
        .admin-order-mobile-card .badge-demo {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.35);
          font-size: 0.58rem;
          font-weight: 900;
          padding: 1px 5px;
          border-radius: 4px;
        }
        .admin-order-mobile-card .order-card-body {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }
        .admin-order-mobile-card .order-card-customer {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .admin-order-mobile-card .customer-name {
          font-size: 0.88rem;
          font-weight: 800;
          color: #ffffff;
        }
        .admin-order-mobile-card .customer-email {
          font-size: 0.72rem;
          color: #a1a1aa;
        }
        .admin-order-mobile-card .customer-location {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          color: #ff7733;
          font-weight: 700;
          margin-top: 2px;
        }
        .admin-order-mobile-card .order-card-total {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .admin-order-mobile-card .order-card-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          background: rgba(0, 0, 0, 0.25);
          padding: 6px 10px;
          border-radius: 8px;
        }
        .admin-order-mobile-card .order-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .tracking-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.25);
          padding: 4px 8px;
          border-radius: 4px;
          color: #4ade80;
          font-size: 0.72rem;
          font-weight: 800;
          font-family: monospace;
        }
        .no-tracking-pill {
          color: #71717a;
          font-size: 0.72rem;
          font-style: italic;
        }

        .admin-main-area {
          padding: 16px 14px 60px 14px !important;
          width: 100% !important;
          max-width: 100vw !important;
          overflow-x: hidden !important;
        }

        /* Sidebar is hidden on Mobile (Navigation handled by Bento Hub) */
        .admin-sidebar,
        .admin-sidebar-backdrop {
          display: none !important;
        }

        /* Bento Metrics & Cards Grid */
        .metrics-grid,
        .admin-stats-grid,
        .analytics-grid,
        .analytics-cards-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 12px !important;
        }

        /* Filters & Actions Bar */
        .tab-header,
        .tab-header-actions,
        .filters-row,
        .orders-filters-bar,
        .products-filter-bar {
          flex-direction: column !important;
          align-items: stretch !important;
          gap: 10px !important;
        }

        /* Settings Tab Responsive System */
        .admin-settings-layout {
          display: block !important;
          width: 100% !important;
        }
        .admin-settings-subnav.mobile-hidden {
          display: none !important;
        }
        .admin-settings-subnav.mobile-visible {
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
          padding: 8px !important;
          width: 100% !important;
        }
        .admin-settings-panel.mobile-hidden {
          display: none !important;
        }
        .admin-settings-panel.mobile-visible {
          display: block !important;
          width: 100% !important;
        }
        .admin-settings-mobile-sub-back {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          margin-bottom: 16px !important;
          padding-bottom: 12px !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        .admin-settings-back-btn {
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          padding: 6px 12px !important;
          background: rgba(255, 255, 255, 0.06) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 8px !important;
          color: #ffffff !important;
          font-size: 0.76rem !important;
          font-weight: 700 !important;
          cursor: pointer !important;
        }
        .admin-settings-back-btn:active {
          transform: scale(0.96) !important;
        }
        .admin-settings-sub-title {
          font-size: 0.82rem !important;
          font-weight: 800 !important;
          color: #ff5500 !important;
        }
        .admin-settings-preview-grid {
          display: flex !important;
          flex-direction: column !important;
          gap: 20px !important;
          width: 100% !important;
        }
        .admin-settings-cards-2col {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 10px !important;
          width: 100% !important;
        }

        .settings-main-header.mobile-hidden {
          display: none !important;
        }

        .form-row {
          flex-direction: column !important;
          gap: 14px !important;
          width: 100% !important;
        }
        .form-row > * {
          width: 100% !important;
          flex: none !important;
        }

        .filters-row > *,
        .tab-header-actions > * {
          width: 100% !important;
        }
      }

      /* MEDIA QUERIES FOR <= 520px */
      @media (max-width: 520px) {
        .admin-mobile-bento-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 10px !important;
        }
        .admin-bento-card {
          padding: 12px !important;
          min-height: 115px !important;
        }
        .admin-bento-card strong {
          font-size: 0.85rem !important;
        }
        .admin-bento-card span {
          font-size: 0.65rem !important;
        }
      }
    `}</style>
  );
}
