import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useState } from 'react';
import { MapPin, Send, Loader2, CheckCircle2, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Configuration
const PACKAGE_ID = '0x7fe284ce69c9bd0cbd43637b3a5bb961b71df27eb66ac40efe90b179bfa6df6c';
const MODULE_NAME = 'locus';
const CLOCK_OBJECT_ID = '0x6';

function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [proposalText, setProposalText] = useState('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleCheckIn = () => {
    if (!account) return;
    setIsCheckingIn(true);
    setStatus(null);

    const tx = new Transaction();
    // check_in(location: String, clock: &Clock)
    // String in Move is often passed as a pure string or vector<u8> depending on the wrapper.
    // The user request said: Arguments: `vector<u8>` (string "Tokyo"), and `0x6` (Sui Clock Object).
    // In TS SDK, we can pass string for vector<u8> if using Pure, but let's be explicit.
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::check_in`,
      arguments: [
        tx.pure.string("Tokyo"),
        tx.object(CLOCK_OBJECT_ID),
      ],
    });

    signAndExecuteTransaction(
      { transaction: tx },
      {
        onSuccess: (result) => {
          console.log('Check-in success:', result);
          setStatus({ type: 'success', message: 'Checked in successfully at Tokyo!' });
          setIsCheckingIn(false);
        },
        onError: (error) => {
          console.error('Check-in failed:', error);
          setStatus({ type: 'error', message: `Check-in failed: ${error.message}` });
          setIsCheckingIn(false);
        },
      },
    );
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !proposalText.trim()) return;
    setIsSubmitting(true);
    setStatus(null);

    const tx = new Transaction();
    // create_proposal(description: String, ...) - assuming signature based on request
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_proposal`,
      arguments: [
        tx.pure.string(proposalText),
      ],
    });

    signAndExecuteTransaction(
      { transaction: tx },
      {
        onSuccess: (result) => {
          console.log('Proposal created:', result);
          setStatus({ type: 'success', message: 'Proposal submitted successfully!' });
          setProposalText('');
          setIsSubmitting(false);
        },
        onError: (error) => {
          console.error('Proposal failed:', error);
          setStatus({ type: 'error', message: `Submission failed: ${error.message}` });
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="w-full max-w-md z-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Locus
          </h1>
          <p className="text-muted-foreground">Decentralized Location Proofs</p>
        </div>

        {/* Wallet Connection */}
        <div className="flex justify-center">
          <ConnectButton className="!bg-secondary !text-white !rounded-lg !font-medium !px-6 !py-3 hover:!bg-secondary/80 transition-all" />
        </div>

        {!account ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card text-center py-12"
          >
            <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Connect your wallet to continue</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Status Message */}
            <AnimatePresence mode="wait">
              {status && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={clsx(
                    "p-4 rounded-lg flex items-center gap-3 text-sm font-medium",
                    status.type === 'success' ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                  )}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Check In Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card space-y-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold">Current Location</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Verify your presence at <span className="text-white font-medium">Tokyo</span> on-chain.
              </p>
              <button
                onClick={handleCheckIn}
                disabled={isCheckingIn}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isCheckingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check In Now'}
              </button>
            </motion.div>

            {/* Proposal Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card space-y-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <Send className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold">New Proposal</h2>
              </div>
              <form onSubmit={handleSubmitProposal} className="space-y-4">
                <input
                  type="text"
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  placeholder="Describe your proposal..."
                  className="input-field"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !proposalText.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 shadow-none"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Proposal'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
