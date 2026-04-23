import React from 'react';
import { motion } from 'framer-motion';
import { GithubIcon } from '../components/ui/GithubIcon';
import { Button } from '../components/ui/Button';
import { loginWithGitHub } from '../lib/auth';

export const Login: React.FC = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
        <div className="flex flex-col space-y-2 text-center">
          <GithubIcon className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight font-mono">
            RepoManager
          </h1>
          <p className="text-sm text-muted-foreground">
            Take full control of all your GitHub repositories from a single, beautiful dashboard.
          </p>
        </div>
        
        <div className="grid gap-6">
          <Button onClick={loginWithGitHub} className="w-full gap-2" size="lg">
            <GithubIcon className="h-5 w-5" />
            Continue with GitHub
          </Button>
        </div>
        
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};
