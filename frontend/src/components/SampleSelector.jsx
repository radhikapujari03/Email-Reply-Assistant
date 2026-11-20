import React from 'react';
import { Sparkles, Calendar, Briefcase, GraduationCap, CheckSquare } from 'lucide-react';

const SAMPLES = [
  {
    id: 'reschedule',
    label: 'Meeting Reschedule',
    icon: Calendar,
    text: `Hi Alex,\n\nI hope you're having a productive week. Regarding our scheduled strategy review call tomorrow at 2:00 PM EST, something urgent has come up on my end with a client deployment. Would it be possible for us to reschedule our discussion to either Thursday at 11:00 AM EST or Friday afternoon? Let me know what works best for your schedule.\n\nBest,\nSarah Jenkins\nDirector of Operations`
  },
  {
    id: 'project-update',
    label: 'Project Status Inquiry',
    icon: Briefcase,
    text: `Hello Team,\n\nCould someone provide an updated status on the Q4 generative AI prototype milestone? Our executive leadership requested a summary of completed modules, pending blockers, and the anticipated delivery timeline for the client demonstration before Friday's standup.\n\nThanks in advance,\nMarcus Vance\nProduct Manager`
  },
  {
    id: 'academic',
    label: 'Academic Inquiry',
    icon: GraduationCap,
    text: `Dear Student,\n\nI have reviewed your proposal draft for the final year capstone project. While the core concept is promising, you need to expand on the system architecture diagrams and clarify the dataset evaluation metrics. Please submit the revised document by this Wednesday at 5:00 PM so we can finalize your project approval.\n\nRegards,\nDr. Robert Evans\nDepartment of Computer Science`
  },
  {
    id: 'interview',
    label: 'Interview Invitation',
    icon: CheckSquare,
    text: `Hi there,\n\nThank you for taking the time to apply for the Senior AI Engineer position at Apex Technologies. We were very impressed by your background and portfolio. We would love to invite you for a 45-minute virtual technical discussion next week. Could you share your availability between Tuesday and Thursday?\n\nWarm regards,\nElena Rostova\nTalent Acquisition Lead`
  }
];

export default function SampleSelector({ onSelectSample, disabled }) {
  return (
    <div className="w-full mb-3 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-[#A9B8CC] flex items-center mr-1">
        <Sparkles className="w-3 h-3 text-[#16BFD0] mr-1" />
        Quick Test Presets:
      </span>
      {SAMPLES.map((sample) => {
        const IconComponent = sample.icon;
        return (
          <button
            key={sample.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectSample(sample.text)}
            className="flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-lg bg-[#1B2C45] hover:bg-[#1F3452] text-[#A9B8CC] hover:text-[#16BFD0] border border-[#263B58] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#16BFD0]/40"
          >
            <IconComponent className="w-3 h-3 text-[#6FA8FF]" />
            <span>{sample.label}</span>
          </button>
        );
      })}
    </div>
  );
}
