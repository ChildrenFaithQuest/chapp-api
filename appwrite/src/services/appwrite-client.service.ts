import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, Databases, Account } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AppwriteClientService implements OnModuleInit {
  private client: Client;
  private database: Databases;
  private account: Account;

  constructor() {
    const endpoint = process.env.APPWRITE_ENDPOINT;
    const projectId = process.env.APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!endpoint || !projectId || !apiKey) {
      throw new Error(
        'Appwrite endpoint, project ID or api key is not defined',
      );
    }
    // Initialize Appwrite Client
    this.client = new Client()
      .setEndpoint(endpoint) // The Appwrite server endpoint
      .setProject(projectId) // Your Appwrite Project ID
      .setKey(apiKey); // Your Appwrite API Key
  }

  onModuleInit() {
    // Initialize the Databases service
    this.database = new Databases(this.client);
    // Initialize the Account service
    this.account = new Account(this.client);
    console.log('AppwriteService initialized');
  }

  // Getter for Databases service
  getDatabaseService() {
    return this.database;
  }

  // Getter for Account service
  getAccountService() {
    return this.account;
  }

  setJWT(token: string): void {
    this.client.setJWT(token);
  }
}
