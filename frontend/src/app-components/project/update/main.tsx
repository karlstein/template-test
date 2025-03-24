"use client";

import React, { use, useMemo, useState } from "react";
import ProjectCard from "../project.card";
import UpdateList from "./update-list";
import { UpdateListPageProps } from "@/app/project/update/[project]/page";
import { ProjectModel, ProjectUpdatesModel } from "@/types";
import { toast } from "react-toastify";
import Button from "@/components/button";
import PlusSvg from "@/assets/svgs/plus";
import GenerateKeyModal from "./generate-key-modal";

const ProjectUpdateMain = (props: UpdateListPageProps) => {
  const propParams = use(props.params);
  const [projectUpdates, setProjectUpdates] = useState<ProjectUpdatesModel>();
  const [modalCtrl, setModalCtrl] = useState<
    { open: true; type: "view" | "add" } | { open: false }
  >({
    open: false,
  });

  // get project base64 from url param then parse it as ProjectModel
  const project = useMemo(() => {
    let projectDummy: ProjectModel | null = null;

    try {
      if (!propParams.project) throw "Project undefined";
      projectDummy = JSON.parse(
        Buffer.from(
          propParams.project.substring(0, propParams.project.length - 4),
          "base64"
        ).toString()
      );
      console.log("\u231B cp-server - main - projectDummy", projectDummy);
    } catch (error) {
      console.error("\u231B cp-server - main - error", error);
      toast(`Something wrong! ${error as any}`, { type: "error" });
      projectDummy = null;
    }

    return projectDummy;
  }, [propParams.project]);

  // TODO - 2.2 You should get project updates data here and to pass it into state.

  const renderModal = () => {
    return (
      <>
        {modalCtrl.open && (
          <GenerateKeyModal
            modalType={modalCtrl.type}
            onClose={() => setModalCtrl({ open: false })}
            projectId={project?.id}
          />
        )}
      </>
    );
  };

  return (
    <div className="flex flex-row flex-wrap gap-6">
      <div className="flex flex-col gap-6">
        <ProjectCard project={project || projectUpdates?.project} disabled />
        <Button
          title={{
            default: "Generate Key",
            sm: "Key",
          }}
          onClick={() => setModalCtrl({ open: true, type: "add" })}
          lead={<PlusSvg />}
        />
      </div>
      <UpdateList updates={projectUpdates?.updates} />
      {renderModal()}
    </div>
  );
};

export default ProjectUpdateMain;
