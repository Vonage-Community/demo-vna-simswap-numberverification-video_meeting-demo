import expressWs from 'express-ws';
import express from 'express';

const { app, getWss } = expressWs(express());

export function getApp() {
    return app;
}

export function getWebsocket() {
    return getWss();
}